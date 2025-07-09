import { db } from './db';
import { users, snippets } from './db/schema';
import { randomUUID } from 'crypto';

// Sample users data with SEO configurations
const sampleUsers = [
  {
    githubId: 123456,
    username: 'johndoe',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatarUrl: 'https://avatars.githubusercontent.com/u/123456?v=4',
    bio: 'Full-stack developer passionate about clean code and modern web technologies.',
    location: 'San Francisco, CA',
    blog: 'https://johndoe.dev',
    company: 'TechCorp',
    publicRepos: 42,
    followers: 150,
    following: 75,
    seoTitle: 'John Doe - Full Stack Developer | Code Snippets',
    seoDescription: 'Explore John Doe\'s collection of code snippets, tutorials, and programming examples. Full-stack developer sharing knowledge about modern web development.',
    seoKeywords: 'javascript, react, node.js, typescript, full-stack, web development',
    seoImageUrl: 'https://johndoe.dev/og-image.jpg',
    customHeaderTitle: 'Welcome to My Code Collection',
    customHeaderDescription: 'A curated collection of code snippets and programming solutions',
    customBrandingColor: '#3b82f6',
    customBrandingLogo: 'https://johndoe.dev/logo.png',
    uiTheme: 'light',
    codeTheme: 'github',
    profileBannerUrl: 'https://johndoe.dev/banner.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    },
    customDomain: 'snippets.johndoe.dev',
    isProfilePublic: true,
    showGithubStats: true,
    showActivityFeed: true,
    emailNotifications: true,
    enableAnalytics: true,
    twoFactorEnabled: false
  },
  {
    githubId: 789012,
    username: 'janesmithdev',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    avatarUrl: 'https://avatars.githubusercontent.com/u/789012?v=4',
    bio: 'Senior Frontend Developer specializing in React and TypeScript.',
    location: 'New York, NY',
    blog: 'https://janesmith.tech',
    company: 'InnovateLabs',
    publicRepos: 67,
    followers: 280,
    following: 95,
    seoTitle: 'Jane Smith - Frontend Developer | React & TypeScript Expert',
    seoDescription: 'Jane Smith\'s curated collection of React, TypeScript, and frontend development code snippets. Learn modern web development techniques.',
    seoKeywords: 'react, typescript, frontend, javascript, css, html, web development',
    seoImageUrl: 'https://janesmith.tech/og-image.jpg',
    customHeaderTitle: 'Frontend Code Mastery',
    customHeaderDescription: 'Professional frontend development snippets and best practices',
    customBrandingColor: '#ec4899',
    customBrandingLogo: 'https://janesmith.tech/logo.png',
    uiTheme: 'dark',
    codeTheme: 'dracula',
    profileBannerUrl: 'https://janesmith.tech/banner.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/janesmithdev',
      linkedin: 'https://linkedin.com/in/janesmithdev',
      github: 'https://github.com/janesmithdev'
    },
    customDomain: 'code.janesmith.tech',
    isProfilePublic: true,
    showGithubStats: true,
    showActivityFeed: true,
    emailNotifications: true,
    enableAnalytics: true,
    twoFactorEnabled: true
  },
  {
    githubId: 345678,
    username: 'alexcoder',
    email: 'alex@example.com',
    name: 'Alex Johnson',
    avatarUrl: 'https://avatars.githubusercontent.com/u/345678?v=4',
    bio: 'Backend developer and DevOps enthusiast. Love working with Python and Go.',
    location: 'Austin, TX',
    blog: 'https://alexcodes.io',
    company: 'CloudTech Solutions',
    publicRepos: 89,
    followers: 320,
    following: 110,
    seoTitle: 'Alex Johnson - Backend Developer | Python & Go Specialist',
    seoDescription: 'Discover Alex Johnson\'s backend development snippets featuring Python, Go, DevOps, and cloud technologies. Professional code examples and tutorials.',
    seoKeywords: 'python, go, backend, devops, cloud, docker, kubernetes, api',
    seoImageUrl: 'https://alexcodes.io/og-image.jpg',
    customHeaderTitle: 'Backend & DevOps Solutions',
    customHeaderDescription: 'Scalable backend solutions and infrastructure code',
    customBrandingColor: '#10b981',
    customBrandingLogo: 'https://alexcodes.io/logo.png',
    uiTheme: 'system',
    codeTheme: 'monokai',
    profileBannerUrl: 'https://alexcodes.io/banner.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/alexcoder',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexcoder'
    },
    customDomain: 'snippets.alexcodes.io',
    isProfilePublic: true,
    showGithubStats: true,
    showActivityFeed: true,
    emailNotifications: false,
    enableAnalytics: true,
    twoFactorEnabled: false
  }
];

// Sample snippets with SEO configurations
const sampleSnippets = [
  {
    title: 'React Custom Hook for API Calls',
    description: 'A reusable custom hook for making API calls with loading states, error handling, and data caching.',
    code: `import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string, options?: RequestInit): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Usage example:
// const { data, loading, error, refetch } = useApi<User[]>('/api/users');`,
    language: 'typescript',
    tags: ['react', 'hooks', 'api', 'typescript', 'custom-hook'],
    isPublic: true,
    shareId: randomUUID(),
    seoTitle: 'React Custom Hook for API Calls - useApi Hook with TypeScript',
    seoDescription: 'Learn how to create a powerful custom React hook for API calls with loading states, error handling, and data caching. Complete TypeScript implementation.',
    seoKeywords: 'react, custom hook, api, typescript, useapi, loading states, error handling',
    seoImageUrl: 'https://snippet-box.dev/og/react-useapi-hook.jpg',
    customSlug: 'react-custom-hook-api-calls'
  },
  {
    title: 'Python Async Context Manager',
    description: 'A reusable async context manager for handling database connections and transactions safely.',
    code: `import asyncio
import asyncpg
from contextlib import asynccontextmanager
from typing import AsyncGenerator

class DatabaseManager:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.pool = None
    
    async def create_pool(self):
        self.pool = await asyncpg.create_pool(self.connection_string)
    
    async def close_pool(self):
        if self.pool:
            await self.pool.close()
    
    @asynccontextmanager
    async def get_connection(self) -> AsyncGenerator[asyncpg.Connection, None]:
        if not self.pool:
            raise RuntimeError("Database pool not initialized")
        
        connection = await self.pool.acquire()
        try:
            yield connection
        finally:
            await self.pool.release(connection)
    
    @asynccontextmanager
    async def transaction(self) -> AsyncGenerator[asyncpg.Connection, None]:
        async with self.get_connection() as conn:
            tx = conn.transaction()
            await tx.start()
            try:
                yield conn
                await tx.commit()
            except Exception:
                await tx.rollback()
                raise

# Usage example:
async def main():
    db = DatabaseManager("postgresql://user:pass@localhost/db")
    await db.create_pool()
    
    try:
        async with db.transaction() as conn:
            await conn.execute("INSERT INTO users (name) VALUES ($1)", "John")
            await conn.execute("INSERT INTO profiles (user_id) VALUES ($1)", 1)
            # If any query fails, both will be rolled back
    finally:
        await db.close_pool()

if __name__ == "__main__":
    asyncio.run(main())`,
    language: 'python',
    tags: ['python', 'async', 'context-manager', 'database', 'postgresql'],
    isPublic: true,
    shareId: randomUUID(),
    seoTitle: 'Python Async Context Manager for Database Transactions',
    seoDescription: 'Learn how to create a robust async context manager in Python for handling database connections and transactions safely with proper error handling.',
    seoKeywords: 'python, async, context manager, database, postgresql, transactions, asyncpg',
    seoImageUrl: 'https://snippet-box.dev/og/python-async-context-manager.jpg',
    customSlug: 'python-async-context-manager'
  },
  {
    title: 'Go HTTP Middleware Chain',
    description: 'A flexible middleware chain implementation for Go HTTP servers with logging, authentication, and CORS support.',
    code: `package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "strings"
    "time"
)

type Middleware func(http.Handler) http.Handler

// Chain applies middlewares to a handler
func Chain(h http.Handler, middlewares ...Middleware) http.Handler {
    for i := len(middlewares) - 1; i >= 0; i-- {
        h = middlewares[i](h)
    }
    return h
}

// Logging middleware
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        // Wrap the ResponseWriter to capture status code
        wrapped := &responseWriter{ResponseWriter: w, statusCode: 200}
        
        next.ServeHTTP(wrapped, r)
        
        duration := time.Since(start)
        log.Printf("%s %s %d %v", r.Method, r.URL.Path, wrapped.statusCode, duration)
    })
}

// CORS middleware
func CorsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

// Authentication middleware
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            http.Error(w, "Authorization header required", http.StatusUnauthorized)
            return
        }
        
        // Simple token validation (replace with your auth logic)
        token := strings.TrimPrefix(authHeader, "Bearer ")
        if token == "" {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        // Add user info to context
        ctx := context.WithValue(r.Context(), "user", map[string]string{
            "id":    "123",
            "email": "user@example.com",
        })
        
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// Response writer wrapper to capture status code
type responseWriter struct {
    http.ResponseWriter
    statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

// Example handlers
func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to the home page!")
}

func protectedHandler(w http.ResponseWriter, r *http.Request) {
    user := r.Context().Value("user")
    fmt.Fprintf(w, "Protected content for user: %+v", user)
}

func main() {
    // Create handlers with middleware chains
    publicHandler := Chain(
        http.HandlerFunc(homeHandler),
        LoggingMiddleware,
        CorsMiddleware,
    )
    
    protectedHandler := Chain(
        http.HandlerFunc(protectedHandler),
        LoggingMiddleware,
        CorsMiddleware,
        AuthMiddleware,
    )
    
    // Register routes
    http.Handle("/", publicHandler)
    http.Handle("/protected", protectedHandler)
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}`,
    language: 'go',
    tags: ['go', 'http', 'middleware', 'server', 'authentication', 'cors'],
    isPublic: true,
    shareId: randomUUID(),
    seoTitle: 'Go HTTP Middleware Chain - Authentication, CORS, and Logging',
    seoDescription: 'Complete Go HTTP middleware chain implementation with authentication, CORS, and logging. Learn how to build flexible middleware systems in Go.',
    seoKeywords: 'go, http, middleware, authentication, cors, logging, web server',
    seoImageUrl: 'https://snippet-box.dev/og/go-middleware-chain.jpg',
    customSlug: 'go-http-middleware-chain'
  },
  {
    title: 'JavaScript Debounce and Throttle Utilities',
    description: 'Utility functions for debouncing and throttling function calls, perfect for handling user input and API calls.',
    code: `// Debounce function - delays execution until after wait milliseconds have passed
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Throttle function - limits execution to once per wait milliseconds
function throttle(func, wait) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// Advanced debounce with leading and trailing options
function advancedDebounce(func, wait, options = {}) {
  let timeout;
  let previous = 0;
  
  const { leading = false, trailing = true, maxWait } = options;
  
  return function executedFunction(...args) {
    const now = Date.now();
    
    if (!previous && leading === false) previous = now;
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      func.apply(this, args);
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(() => {
        previous = leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// Usage examples:

// Debounce search input
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Make API call here
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle scroll events
const throttledScroll = throttle(() => {
  console.log('Scroll event fired');
  // Handle scroll logic here
}, 100);

window.addEventListener('scroll', throttledScroll);

// Advanced debounce for complex scenarios
const advancedDebouncedResize = advancedDebounce(
  () => {
    console.log('Window resized');
    // Handle resize logic
  },
  250,
  { leading: true, trailing: true, maxWait: 1000 }
);

window.addEventListener('resize', advancedDebouncedResize);

// Promise-based debounce for async operations
function debouncePromise(func, wait) {
  let timeout;
  let resolveList = [];
  
  return function executedFunction(...args) {
    return new Promise((resolve) => {
      resolveList.push(resolve);
      
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          const result = await func.apply(this, args);
          resolveList.forEach(res => res(result));
        } catch (error) {
          resolveList.forEach(res => res(Promise.reject(error)));
        } finally {
          resolveList = [];
        }
      }, wait);
    });
  };
}

// Usage with async function
const debouncedApiCall = debouncePromise(async (query) => {
  const response = await fetch(\`/api/search?q=\${query}\`);
  return response.json();
}, 300);

// Multiple calls will share the same result
debouncedApiCall('test').then(result => console.log('Result 1:', result));
debouncedApiCall('test').then(result => console.log('Result 2:', result));`,
    language: 'javascript',
    tags: ['javascript', 'debounce', 'throttle', 'performance', 'utilities'],
    isPublic: true,
    shareId: randomUUID(),
    seoTitle: 'JavaScript Debounce and Throttle Utilities - Complete Guide',
    seoDescription: 'Master JavaScript debounce and throttle utilities with advanced implementations. Improve performance and handle user input efficiently.',
    seoKeywords: 'javascript, debounce, throttle, performance, utilities, async, promises',
    seoImageUrl: 'https://snippet-box.dev/og/javascript-debounce-throttle.jpg',
    customSlug: 'javascript-debounce-throttle-utilities'
  },
  {
    title: 'CSS Grid Layout System',
    description: 'A comprehensive CSS Grid system with responsive breakpoints and utility classes for modern web layouts.',
    code: `/* CSS Grid Layout System */
/* Base Grid Container */
.grid {
  display: grid;
  gap: 1rem;
}

/* Grid Template Columns */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* Auto-fit and Auto-fill */
.grid-auto-fit { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.grid-auto-fill { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }

/* Grid Template Rows */
.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }
.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }
.grid-rows-3 { grid-template-rows: repeat(3, minmax(0, 1fr)); }
.grid-rows-4 { grid-template-rows: repeat(4, minmax(0, 1fr)); }

/* Column Span */
.col-span-1 { grid-column: span 1 / span 1; }
.col-span-2 { grid-column: span 2 / span 2; }
.col-span-3 { grid-column: span 3 / span 3; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-5 { grid-column: span 5 / span 5; }
.col-span-6 { grid-column: span 6 / span 6; }
.col-span-full { grid-column: 1 / -1; }

/* Row Span */
.row-span-1 { grid-row: span 1 / span 1; }
.row-span-2 { grid-row: span 2 / span 2; }
.row-span-3 { grid-row: span 3 / span 3; }
.row-span-4 { grid-row: span 4 / span 4; }
.row-span-full { grid-row: 1 / -1; }

/* Grid Start/End */
.col-start-1 { grid-column-start: 1; }
.col-start-2 { grid-column-start: 2; }
.col-start-3 { grid-column-start: 3; }
.col-end-1 { grid-column-end: 1; }
.col-end-2 { grid-column-end: 2; }
.col-end-3 { grid-column-end: 3; }

/* Gap Utilities */
.gap-0 { gap: 0; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* Justify and Align */
.justify-start { justify-content: start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

.items-start { align-items: start; }
.items-center { align-items: center; }
.items-end { align-items: end; }
.items-stretch { align-items: stretch; }

.place-items-start { place-items: start; }
.place-items-center { place-items: center; }
.place-items-end { place-items: end; }
.place-items-stretch { place-items: stretch; }

/* Responsive Design */
@media (min-width: 640px) {
  .sm\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .sm\\:col-span-1 { grid-column: span 1 / span 1; }
  .sm\\:col-span-2 { grid-column: span 2 / span 2; }
  .sm\\:col-span-3 { grid-column: span 3 / span 3; }
  .sm\\:col-span-4 { grid-column: span 4 / span 4; }
}

@media (min-width: 768px) {
  .md\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .md\\:grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .md\\:col-span-1 { grid-column: span 1 / span 1; }
  .md\\:col-span-2 { grid-column: span 2 / span 2; }
  .md\\:col-span-3 { grid-column: span 3 / span 3; }
  .md\\:col-span-4 { grid-column: span 4 / span 4; }
  .md\\:col-span-6 { grid-column: span 6 / span 6; }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\\:grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .lg\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  .lg\\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\\:col-span-3 { grid-column: span 3 / span 3; }
  .lg\\:col-span-4 { grid-column: span 4 / span 4; }
  .lg\\:col-span-6 { grid-column: span 6 / span 6; }
  .lg\\:col-span-8 { grid-column: span 8 / span 8; }
  .lg\\:col-span-12 { grid-column: span 12 / span 12; }
}

/* Common Layout Patterns */
.dashboard-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "sidebar footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.dashboard-header { grid-area: header; }
.dashboard-sidebar { grid-area: sidebar; }
.dashboard-main { grid-area: main; }
.dashboard-footer { grid-area: footer; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 20px;
  gap: 1rem;
}

.masonry-item {
  grid-row-end: span var(--row-span, 10);
}

/* Example HTML Usage:
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="col-span-1">Item 1</div>
  <div class="col-span-1 md:col-span-2">Item 2</div>
  <div class="col-span-1">Item 3</div>
</div>

<div class="dashboard-layout">
  <header class="dashboard-header">Header</header>
  <aside class="dashboard-sidebar">Sidebar</aside>
  <main class="dashboard-main">Main Content</main>
  <footer class="dashboard-footer">Footer</footer>
</div>
*/`,
    language: 'css',
    tags: ['css', 'grid', 'layout', 'responsive', 'utilities'],
    isPublic: true,
    shareId: randomUUID(),
    seoTitle: 'CSS Grid Layout System - Complete Responsive Grid Framework',
    seoDescription: 'Comprehensive CSS Grid system with responsive breakpoints, utility classes, and common layout patterns. Perfect for modern web development.',
    seoKeywords: 'css, grid, layout, responsive, utilities, framework, web design',
    seoImageUrl: 'https://snippet-box.dev/og/css-grid-layout-system.jpg',
    customSlug: 'css-grid-layout-system'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data (optional - uncomment if needed)
    // console.log('Clearing existing data...');
    // await db.delete(snippets);
    // await db.delete(users);
    
    // Insert users
    console.log('Inserting users...');
    const insertedUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users`);
    
    // Prepare snippets with user IDs
    if (insertedUsers.length === 0) {
      throw new Error('No users were inserted');
    }
    
    const snippetsWithUserIds = sampleSnippets.map((snippet, index) => ({
      ...snippet,
      userId: insertedUsers[index % insertedUsers.length]!.id // Distribute snippets among users
    }));
    
    // Insert snippets
    console.log('Inserting snippets...');
    const insertedSnippets = await db.insert(snippets).values(snippetsWithUserIds).returning();
    console.log(`✅ Inserted ${insertedSnippets.length} snippets`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\nSeeded data summary:');
    console.log(`Users: ${insertedUsers.length}`);
    console.log(`Snippets: ${insertedSnippets.length}`);
    
    // Display user information
    console.log('\n👥 Users created:');
    insertedUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (@${user.username})`);
      console.log(`     Email: ${user.email}`);
      console.log(`     SEO Title: ${user.seoTitle}`);
      console.log(`     Custom Domain: ${user.customDomain}`);
      console.log(`     Public Profile: ${user.isProfilePublic ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Display snippet information
    console.log('📝 Snippets created:');
    insertedSnippets.forEach((snippet, index) => {
      console.log(`  ${index + 1}. ${snippet.title} (${snippet.language})`);
      console.log(`     SEO Title: ${snippet.seoTitle}`);
      console.log(`     Custom Slug: ${snippet.customSlug}`);
      console.log(`     Public: ${snippet.isPublic ? 'Yes' : 'No'}`);
      console.log(`     Share ID: ${snippet.shareId}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Export for use in other files
export { seedDatabase };

// Run seeding if this file is executed directly
if (import.meta.main) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
