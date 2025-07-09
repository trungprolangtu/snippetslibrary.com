import { Hono } from 'hono';
import { eq, desc, and, or } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { snippets, users } from '../db/schema';
import { authMiddleware, optionalAuthMiddleware, type Variables } from '../lib/middleware';
import { enhancedValidationSchemas } from '../lib/validation';
import type { ApiResponse } from 'shared';

const snippetsRouter = new Hono<{ Variables: Partial<Variables> }>();

// Enhanced validation schemas
const createSnippetSchema = z.object({
  title: enhancedValidationSchemas.snippetTitle,
  description: enhancedValidationSchemas.snippetDescription,
  code: enhancedValidationSchemas.snippetCode,
  language: enhancedValidationSchemas.language,
  tags: enhancedValidationSchemas.tags,
  isPublic: z.boolean().default(false),
});

const updateSnippetSchema = z.object({
  title: enhancedValidationSchemas.snippetTitle.optional(),
  description: enhancedValidationSchemas.snippetDescription.optional(),
  code: enhancedValidationSchemas.snippetCode.optional(),
  language: enhancedValidationSchemas.language.optional(),
  tags: enhancedValidationSchemas.tags.optional(),
  isPublic: z.boolean().optional(),
});

const paginationSchema = z.object({
  page: enhancedValidationSchemas.page,
  limit: enhancedValidationSchemas.limit,
  search: enhancedValidationSchemas.searchQuery,
});

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  let userRequests = rateLimitMap.get(key);
  if (!userRequests || userRequests.resetTime < windowStart) {
    userRequests = { count: 0, resetTime: now + windowMs };
    rateLimitMap.set(key, userRequests);
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count++;
  return true;
};

// Sanitize snippet data before sending to client
const sanitizeSnippet = (snippet: any) => {
  return {
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    code: snippet.code,
    language: snippet.language,
    tags: snippet.tags || [],
    isPublic: snippet.isPublic,
    shareId: snippet.shareId,
    createdAt: snippet.createdAt,
    updatedAt: snippet.updatedAt,
    userId: snippet.userId,
  };
};

// Create snippet
snippetsRouter.post('/', 
  authMiddleware,
  zValidator('json', createSnippetSchema),
  async (c) => {
    const session = c.get('session')!;
    const data = c.req.valid('json');

    // Rate limiting: 10 snippets per hour per user
    const rateLimitKey = `create:${session.user.id}`;
    if (!rateLimit(rateLimitKey, 10, 60 * 60 * 1000)) {
      return c.json<ApiResponse>({
        message: 'Rate limit exceeded. Please try again later.',
        success: false
      }, 429);
    }

    try {
      const [snippet] = await db
        .insert(snippets)
        .values({
          title: data.title,
          description: data.description || null,
          code: data.code,
          language: data.language,
          tags: data.tags || [],
          isPublic: data.isPublic,
          userId: session.user.id,
        })
        .returning();

      return c.json<ApiResponse>({
        message: 'Snippet created successfully',
        success: true,
        data: { snippet: sanitizeSnippet(snippet) }
      });
    } catch (error) {
      console.error('Create snippet error:', error);
      return c.json<ApiResponse>({
        message: 'Failed to create snippet',
        success: false
      }, 500);
    }
  }
);

// Get snippets
snippetsRouter.get('/',
  optionalAuthMiddleware,
  zValidator('query', paginationSchema),
  async (c) => {
    const session = c.get('session');
    const { page, limit } = c.req.valid('query');
    const offset = (page - 1) * limit;
    
    try {
      let whereCondition;
      
      if (session) {
        // Show public snippets and user's own snippets
        whereCondition = or(
          eq(snippets.isPublic, true),
          eq(snippets.userId, session.user.id)
        );
      } else {
        // Show only public snippets
        whereCondition = eq(snippets.isPublic, true);
      }

      const results = await db
        .select({
          snippet: snippets,
          user: {
            id: users.id,
            username: users.username,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(snippets)
        .leftJoin(users, eq(snippets.userId, users.id))
        .where(whereCondition)
        .orderBy(desc(snippets.createdAt))
        .limit(limit)
        .offset(offset);

      const snippetsData = results.map(row => ({
        ...sanitizeSnippet(row.snippet),
        user: row.user ? {
          id: row.user.id,
          username: row.user.username,
          name: row.user.name,
          avatarUrl: row.user.avatarUrl,
        } : null,
      }));

      return c.json<ApiResponse>({
        message: 'Snippets retrieved successfully',
        success: true,
        data: { 
          snippets: snippetsData,
          pagination: {
            page,
            limit,
            hasMore: results.length === limit
          }
        }
      });
    } catch (error) {
      console.error('Get snippets error:', error);
      return c.json<ApiResponse>({
        message: 'Failed to retrieve snippets',
        success: false
      }, 500);
    }
  }
);

// Get snippet by ID
snippetsRouter.get('/:id', optionalAuthMiddleware, async (c) => {
  const id = c.req.param('id');
  const session = c.get('session');

  // Basic ID validation
  if (!id || typeof id !== 'string' || id.length < 1 || id.length > 100) {
    return c.json<ApiResponse>({
      message: 'Invalid snippet ID',
      success: false
    }, 400);
  }

  try {
    let whereCondition;
    
    if (session) {
      whereCondition = and(
        eq(snippets.id, id),
        or(eq(snippets.isPublic, true), eq(snippets.userId, session.user.id))
      );
    } else {
      whereCondition = and(
        eq(snippets.id, id),
        eq(snippets.isPublic, true)
      );
    }

    const result = await db
      .select({
        snippet: snippets,
        user: {
          id: users.id,
          username: users.username,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(whereCondition)
      .limit(1);

    if (!result.length) {
      return c.json<ApiResponse>({
        message: 'Snippet not found',
        success: false
      }, 404);
    }

    const row = result[0]!;
    const snippetData = {
      ...sanitizeSnippet(row.snippet),
      user: row.user ? {
        id: row.user.id,
        username: row.user.username,
        name: row.user.name,
        avatarUrl: row.user.avatarUrl,
      } : null,
    };

    return c.json<ApiResponse>({
      message: 'Snippet retrieved successfully',
      success: true,
      data: { snippet: snippetData }
    });
  } catch (error) {
    console.error('Get snippet error:', error);
    return c.json<ApiResponse>({
      message: 'Failed to retrieve snippet',
      success: false
    }, 500);
  }
});

// Update snippet
snippetsRouter.put('/:id', 
  authMiddleware,
  zValidator('json', updateSnippetSchema),
  async (c) => {
    const id = c.req.param('id');
    const session = c.get('session')!;
    const data = c.req.valid('json');

    // Basic ID validation
    if (!id || typeof id !== 'string' || id.length < 1 || id.length > 100) {
      return c.json<ApiResponse>({
        message: 'Invalid snippet ID',
        success: false
      }, 400);
    }

    // Rate limiting: 20 updates per hour per user
    const rateLimitKey = `update:${session.user.id}`;
    if (!rateLimit(rateLimitKey, 20, 60 * 60 * 1000)) {
      return c.json<ApiResponse>({
        message: 'Rate limit exceeded. Please try again later.',
        success: false
      }, 429);
    }

    try {
      // Build update object with only provided fields
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.code !== undefined) updateData.code = data.code;
      if (data.language !== undefined) updateData.language = data.language;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

      const [updatedSnippet] = await db
        .update(snippets)
        .set(updateData)
        .where(
          and(
            eq(snippets.id, id),
            eq(snippets.userId, session.user.id)
          )
        )
        .returning();

      if (!updatedSnippet) {
        return c.json<ApiResponse>({
          message: 'Snippet not found or unauthorized',
          success: false
        }, 404);
      }

      return c.json<ApiResponse>({
        message: 'Snippet updated successfully',
        success: true,
        data: { snippet: sanitizeSnippet(updatedSnippet) }
      });
    } catch (error) {
      console.error('Update snippet error:', error);
      return c.json<ApiResponse>({
        message: 'Failed to update snippet',
        success: false
      }, 500);
    }
  }
);

// Delete snippet
snippetsRouter.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const session = c.get('session')!;

  // Basic ID validation
  if (!id || typeof id !== 'string' || id.length < 1 || id.length > 100) {
    return c.json<ApiResponse>({
      message: 'Invalid snippet ID',
      success: false
    }, 400);
  }

  // Rate limiting: 10 deletes per hour per user
  const rateLimitKey = `delete:${session.user.id}`;
  if (!rateLimit(rateLimitKey, 10, 60 * 60 * 1000)) {
    return c.json<ApiResponse>({
      message: 'Rate limit exceeded. Please try again later.',
      success: false
    }, 429);
  }

  try {
    const [deletedSnippet] = await db
      .delete(snippets)
      .where(
        and(
          eq(snippets.id, id),
          eq(snippets.userId, session.user.id)
        )
      )
      .returning();

    if (!deletedSnippet) {
      return c.json<ApiResponse>({
        message: 'Snippet not found or unauthorized',
        success: false
      }, 404);
    }

    return c.json<ApiResponse>({
      message: 'Snippet deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Delete snippet error:', error);
    return c.json<ApiResponse>({
      message: 'Failed to delete snippet',
      success: false
    }, 500);
  }
});

// Share snippet - generate share ID
snippetsRouter.post('/:id/share', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const session = c.get('session')!;

  // Basic ID validation
  if (!id || typeof id !== 'string' || id.length < 1 || id.length > 100) {
    return c.json<ApiResponse>({
      message: 'Invalid snippet ID',
      success: false
    }, 400);
  }

  // Rate limiting: 5 share generations per hour per user
  const rateLimitKey = `share:${session.user.id}`;
  if (!rateLimit(rateLimitKey, 5, 60 * 60 * 1000)) {
    return c.json<ApiResponse>({
      message: 'Rate limit exceeded. Please try again later.',
      success: false
    }, 429);
  }

  try {
    // Generate a secure random share ID
    const shareId = crypto.randomUUID();
    
    const [updatedSnippet] = await db
      .update(snippets)
      .set({
        shareId: shareId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(snippets.id, id),
          eq(snippets.userId, session.user.id)
        )
      )
      .returning();

    if (!updatedSnippet) {
      return c.json<ApiResponse>({
        message: 'Snippet not found or unauthorized',
        success: false
      }, 404);
    }

    return c.json<ApiResponse>({
      message: 'Share link generated successfully',
      success: true,
      data: { shareId: updatedSnippet.shareId }
    });
  } catch (error) {
    console.error('Generate share link error:', error);
    return c.json<ApiResponse>({
      message: 'Failed to generate share link',
      success: false
    }, 500);
  }
});

// Revoke share link
snippetsRouter.delete('/:id/share', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const session = c.get('session')!;

  // Basic ID validation
  if (!id || typeof id !== 'string' || id.length < 1 || id.length > 100) {
    return c.json<ApiResponse>({
      message: 'Invalid snippet ID',
      success: false
    }, 400);
  }

  try {
    const [updatedSnippet] = await db
      .update(snippets)
      .set({
        shareId: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(snippets.id, id),
          eq(snippets.userId, session.user.id)
        )
      )
      .returning();

    if (!updatedSnippet) {
      return c.json<ApiResponse>({
        message: 'Snippet not found or unauthorized',
        success: false
      }, 404);
    }

    return c.json<ApiResponse>({
      message: 'Share link revoked successfully',
      success: true
    });
  } catch (error) {
    console.error('Revoke share link error:', error);
    return c.json<ApiResponse>({
      message: 'Failed to revoke share link',
      success: false
    }, 500);
  }
});

// Get snippet by share ID
snippetsRouter.get('/share/:shareId', optionalAuthMiddleware, async (c) => {
  const shareId = c.req.param('shareId');

  // Basic shareId validation
  if (!shareId || typeof shareId !== 'string' || shareId.length < 1 || shareId.length > 100) {
    return c.json<ApiResponse>({
      message: 'Invalid share ID',
      success: false
    }, 400);
  }

  try {
    const result = await db
      .select({
        snippet: snippets,
        user: {
          id: users.id,
          username: users.username,
          name: users.name,
          avatarUrl: users.avatarUrl,
          seoTitle: users.seoTitle,
          seoDescription: users.seoDescription,
          seoKeywords: users.seoKeywords,
          seoImageUrl: users.seoImageUrl,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(eq(snippets.shareId, shareId))
      .limit(1);

    if (!result.length) {
      return c.json<ApiResponse>({
        message: 'Shared snippet not found',
        success: false
      }, 404);
    }

    const row = result[0]!;
    const snippetData = {
      ...sanitizeSnippet(row.snippet),
      seoTitle: row.snippet.seoTitle,
      seoDescription: row.snippet.seoDescription,
      seoKeywords: row.snippet.seoKeywords,
      seoImageUrl: row.snippet.seoImageUrl,
      user: row.user ? {
        id: row.user.id,
        username: row.user.username,
        name: row.user.name,
        avatarUrl: row.user.avatarUrl,
        seoTitle: row.user.seoTitle,
        seoDescription: row.user.seoDescription,
        seoKeywords: row.user.seoKeywords,
        seoImageUrl: row.user.seoImageUrl,
      } : null,
    };

    return c.json<ApiResponse>({
      message: 'Shared snippet retrieved successfully',
      success: true,
      data: { snippet: snippetData }
    });
  } catch (error) {
    console.error('Get shared snippet error:', error);
    return c.json<ApiResponse>({
      message: 'Failed to retrieve shared snippet',
      success: false
    }, 500);
  }
});

export default snippetsRouter;
