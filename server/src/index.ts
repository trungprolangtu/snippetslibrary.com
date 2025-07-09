import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import auth from './routes/auth';
import snippets from './routes/snippets';
import sitemap from './routes/sitemap';
import type { ApiResponse } from 'shared';

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all variables are set properly.');
  process.exit(1);
}

// Set default values for optional env vars
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log('✅ All required environment variables are loaded');
console.log('🌐 Frontend URL:', process.env.FRONTEND_URL);

const app = new Hono();

// Middleware
app.use('*', logger());

// Security headers middleware
app.use('*', async (c, next) => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.github.com https://static.cloudflareinsights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  c.header('Content-Security-Policy', csp);
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  await next();
});

app.use('*', cors({
  origin: (origin) => {
    console.log('CORS origin request:', origin);
    
    // Allow requests from any localhost port in development
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return origin;
    }
    
    // Allow all Cloudflare domains and subdomains
    if (origin && (
      origin.includes('cloudflare.com') || 
      origin.includes('cloudflareinsights.com') ||
      origin.includes('cf-assets.com') ||
      origin.includes('cloudflarecdn.com') ||
      origin.includes('cloudflare-analytics.com') ||
      origin.includes('cloudflareanalytics.com') ||
      origin.includes('cloudflareinsights.com') ||
      origin.includes('static.cloudflareinsights.com') ||
      origin.endsWith('.cloudflare.com') ||
      origin.endsWith('.cloudflareinsights.com')
    )) {
      return origin;
    }
    
    // Add your production domains here
    const allowedOrigins = [
      'https://snippetslibrary.com',
      'https://www.snippetslibrary.com'
    ];
    
    const isAllowed = allowedOrigins.includes(origin);
    console.log('CORS check:', origin, 'allowed:', isAllowed);
    
    return isAllowed ? origin : null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 86400, // 24 hours
}));

// Explicit OPTIONS handler for preflight requests
app.options('*', (c) => {
  console.log('OPTIONS request to:', c.req.url);
  return c.text('', 204 as any);
});

// Health check
app.get('/', (c) => {
  return c.json<ApiResponse>({
    message: 'Snippet Library API is running!',
    success: true,
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    }
  });
});

// API Routes
app.route('/api/auth', auth);
app.route('/api/snippets', snippets);

// Debug route to check CORS
app.get('/api/debug/cors', (c) => {
  return c.json<ApiResponse>({
    message: 'CORS debug endpoint',
    success: true,
    data: {
      origin: c.req.header('Origin'),
      userAgent: c.req.header('User-Agent'),
      method: c.req.method,
      headers: Object.fromEntries(c.req.raw.headers.entries())
    }
  });
});

// SEO Routes (serve directly without /api prefix)
app.route('/', sitemap);

// 404 handler
app.notFound((c) => {
  return c.json<ApiResponse>({
    message: 'Route not found',
    success: false
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json<ApiResponse>({
    message: 'Internal server error',
    success: false
  }, 500);
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
