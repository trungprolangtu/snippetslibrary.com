import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJWT, getSession } from './auth';
import type { AuthSession } from 'shared';

export interface Variables {
  session: AuthSession;
}

export const authMiddleware = async (c: Context<{ Variables: Variables }>, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '') || 
                getCookie(c, 'auth-token');

  if (!token) {
    return c.json({ message: 'Unauthorized', success: false }, 401);
  }

  try {
    const sessionId = await verifyJWT(token);
    if (!sessionId) {
      return c.json({ message: 'Invalid token', success: false }, 401);
    }

    const session = await getSession(sessionId);
    if (!session) {
      return c.json({ message: 'Session not found', success: false }, 401);
    }

    c.set('session', session);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ message: 'Authentication failed', success: false }, 401);
  }
};

export const optionalAuthMiddleware = async (c: Context<{ Variables: Partial<Variables> }>, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '') || 
                getCookie(c, 'auth-token');

  if (token) {
    const sessionId = await verifyJWT(token);
    if (sessionId) {
      const session = await getSession(sessionId);
      if (session) {
        c.set('session', session);
      }
    }
  }

  await next();
};
