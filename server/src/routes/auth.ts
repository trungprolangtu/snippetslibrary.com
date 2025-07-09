import { Hono } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import { github, createOrUpdateUser, createSession, createJWT, deleteSession, fetchGitHubUser } from '../lib/auth';
import { authMiddleware, type Variables } from '../lib/middleware';
import type { ApiResponse } from 'shared';

const auth = new Hono<{ Variables: Variables }>();

// GitHub OAuth login
auth.get('/login', async (c) => {
  const state = crypto.randomUUID();
  const url = await github.createAuthorizationURL(state, ['user:email', 'read:user']);

  setCookie(c, 'github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 600, // 10 minutes
  });

  return c.json<ApiResponse>({
    message: 'Redirect to GitHub',
    success: true,
    data: { url: url.toString() }
  });
});

// GitHub OAuth callback
auth.get('/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'github_oauth_state');

  if (!code || !state || !storedState || state !== storedState) {
    // Redirect to frontend with error
    return c.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=invalid_oauth`);
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await fetchGitHubUser(tokens.accessToken());
    
    const user = await createOrUpdateUser(githubUser);
    const sessionId = await createSession(user.id, tokens.accessToken());
    const jwt = await createJWT(sessionId);

    setCookie(c, 'auth-token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days instead of 30
    });

    // Clear the OAuth state cookie
    setCookie(c, 'github_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 0,
    });

    // Redirect to frontend dashboard with success
    return c.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?auth=success`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    // Redirect to frontend with error
    return c.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=auth_failed`);
  }
});

// Get current user
auth.get('/me', authMiddleware, async (c) => {
  try {
    const session = c.get('session');
    
    if (!session || !session.user) {
      return c.json<ApiResponse>({
        message: 'User session not found',
        success: false
      }, 401);
    }
    
    return c.json<ApiResponse>({
      message: 'User retrieved successfully',
      success: true,
      data: { user: session.user }
    });
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    return c.json<ApiResponse>({
      message: 'Failed to retrieve user',
      success: false
    }, 500);
  }
});

// Logout
auth.post('/logout', authMiddleware, async (c) => {
  const session = c.get('session');
  
  try {
    await deleteSession(session.user.id);
    
    setCookie(c, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 0,
    });

    return c.json<ApiResponse>({
      message: 'Logged out successfully',
      success: true
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json<ApiResponse>({
      message: 'Logout failed',
      success: false
    }, 500);
  }
});

// Update user profile and settings
auth.put('/profile', authMiddleware, async (c) => {
  const session = c.get('session');
  const body = await c.req.json();
  
  try {
    const { db } = await import('../db');
    const { users } = await import('../db/schema');
    const { eq } = await import('drizzle-orm');
    
    // Validate and sanitize input
    const allowedFields = [
      'username', 'seoTitle', 'seoDescription', 'seoKeywords', 'seoImageUrl',
      'customHeaderTitle', 'customHeaderDescription', 'customBrandingColor',
      'customBrandingLogo', 'uiTheme', 'codeTheme', 'profileBannerUrl',
      'socialLinks', 'customDomain', 'isProfilePublic', 'showGithubStats',
      'showActivityFeed', 'emailNotifications', 'enableAnalytics'
    ];
    
    const updateData: Record<string, any> = {};
    
    // Only update allowed fields
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    // Update the user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();
    
    return c.json<ApiResponse>({
      message: 'Profile updated successfully',
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json<ApiResponse>({
      message: 'Profile update failed',
      success: false
    }, 500);
  }
});

export default auth;
