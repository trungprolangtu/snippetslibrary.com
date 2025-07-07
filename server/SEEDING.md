# Database Seeding Guide

This guide explains how to use the database seeding utilities to populate your development database with sample data.

## Available Commands

### Full Database Seeding
```bash
# Run the complete seeding process with comprehensive sample data
bun run db:seed
```

This will create:
- 3 sample users with complete SEO configurations
- 6 code snippets with SEO metadata
- Users with custom domains, branding, and social links
- Public snippets with share IDs and custom slugs

### Quick Development Setup
```bash
# Quick setup for development (creates 1 user + 1 snippet)
bun run db:seed:quick
```

### Database Statistics
```bash
# Display current database statistics
bun run db:seed:stats
```

### Get First User
```bash
# Get information about the first user in the database
bun run db:seed:first-user
```

### Clear Database
```bash
# Clear all data from the database
bun run db:seed:clear
```

## Sample Data Overview

### Users Created
The full seed creates 3 users with different configurations:

1. **John Doe** (@johndoe)
   - Full-stack developer
   - Custom domain: `snippets.johndoe.dev`
   - SEO optimized profile
   - Light theme preference

2. **Jane Smith** (@janesmithdev)
   - Frontend developer specializing in React/TypeScript
   - Custom domain: `code.janesmith.tech`
   - Dark theme preference
   - 2FA enabled

3. **Alex Johnson** (@alexcoder)
   - Backend developer (Python/Go)
   - Custom domain: `snippets.alexcodes.io`
   - System theme preference
   - Analytics enabled

### Snippets Created
The seed creates 6 diverse code snippets:

1. **React Custom Hook for API Calls** (TypeScript)
   - useApi hook with loading states and error handling
   - SEO slug: `react-custom-hook-api-calls`

2. **Python Async Context Manager** (Python)
   - Database connection management
   - SEO slug: `python-async-context-manager`

3. **Go HTTP Middleware Chain** (Go)
   - Authentication, CORS, and logging middleware
   - SEO slug: `go-http-middleware-chain`

4. **JavaScript Debounce and Throttle Utilities** (JavaScript)
   - Performance optimization utilities
   - SEO slug: `javascript-debounce-throttle-utilities`

5. **CSS Grid Layout System** (CSS)
   - Complete responsive grid framework
   - SEO slug: `css-grid-layout-system`

## SEO Configuration

All seeded data includes comprehensive SEO configurations:

### User SEO Fields
- `seoTitle`: Optimized page titles
- `seoDescription`: Meta descriptions
- `seoKeywords`: Relevant keywords
- `seoImageUrl`: Open Graph images
- `customHeaderTitle`: Custom page headers
- `customHeaderDescription`: Custom descriptions

### Snippet SEO Fields
- `seoTitle`: Snippet-specific titles
- `seoDescription`: Detailed descriptions
- `seoKeywords`: Programming language keywords
- `seoImageUrl`: Code preview images
- `customSlug`: SEO-friendly URLs
- `shareId`: Unique sharing identifiers

## Custom Domains and Branding

Users are configured with:
- Custom domains for public profiles
- Brand colors and logos
- Social media links
- Profile banners
- Theme preferences

## Public Snippets

All snippets are marked as public (`isPublic: true`) and include:
- Share IDs for public sharing
- Custom slugs for SEO-friendly URLs
- Complete metadata for search engines
- Proper tagging and categorization

## Development Workflow

1. **Setup**: Run migrations first
   ```bash
   bun run db:migrate
   ```

2. **Seed**: Add sample data
   ```bash
   bun run db:seed
   ```

3. **Verify**: Check the data
   ```bash
   bun run db:seed:stats
   ```

4. **Develop**: Use the seeded data for development

5. **Reset**: Clear when needed
   ```bash
   bun run db:seed:clear
   ```

## Environment Variables

Make sure your `DATABASE_URL` environment variable is set before running any seeding commands:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

## Notes

- All seeded users have realistic GitHub profile data
- Snippets include practical, real-world code examples
- SEO configurations follow best practices
- Custom domains are configured for testing
- All public snippets are immediately shareable
- Data is designed to showcase all platform features

## Troubleshooting

### Common Issues

1. **Database connection errors**: Verify your `DATABASE_URL`
2. **Migration errors**: Run `bun run db:migrate` first
3. **Unique constraint violations**: Clear the database first with `bun run db:seed:clear`

### Getting Help

If you encounter issues:
1. Check the database connection
2. Verify migrations are up to date
3. Clear the database and try again
4. Check the console output for specific error messages
