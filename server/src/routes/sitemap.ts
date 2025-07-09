import { Hono } from 'hono';
import { eq, and, isNotNull } from 'drizzle-orm';
import { db } from '../db';
import { snippets, users } from '../db/schema';

const sitemapRouter = new Hono();

// Generate XML sitemap
sitemapRouter.get('/sitemap.xml', async (c) => {
  try {
    // Get all public snippets with their share IDs
    const publicSnippets = await db
      .select({
        shareId: snippets.shareId,
        updatedAt: snippets.updatedAt,
        title: snippets.title,
        user: {
          username: users.username,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(and(eq(snippets.isPublic, true), isNotNull(snippets.shareId)))
      .orderBy(snippets.updatedAt);

    // Generate sitemap XML
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const now = new Date().toISOString();
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  
  <!-- Main pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Public shared snippets -->
  ${publicSnippets.map(snippet => `
  <url>
    <loc>${baseUrl}/share/${snippet.shareId}</loc>
    <lastmod>${new Date(snippet.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
</urlset>`;

    return c.body(sitemapXml, 200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return c.text('Error generating sitemap', 500);
  }
});

export default sitemapRouter;
