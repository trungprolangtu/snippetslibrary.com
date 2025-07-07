# 🗃️ Snippets Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

A modern, full-stack code snippet manager built with cutting-edge technologies. Store, organize, and share your code snippets with beautiful syntax highlighting and a clean, intuitive interface.

## ✨ Features

### 🔥 Core Features
- **Smart Code Storage**: Save code snippets with intelligent language detection
- **Syntax Highlighting**: Beautiful syntax highlighting for 20+ programming languages
- **Public/Private Snippets**: Control visibility of your code snippets
- **Instant Search**: Fast search through your snippets by title, description, or content
- **Advanced Filtering**: Filter by language, visibility, and creation date
- **Share Snippets**: Generate shareable links for public snippets
- **Copy to Clipboard**: One-click code copying with visual feedback

### 🎨 User Experience
- **Dark/Light Theme**: Automatic theme switching based on system preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, minimalist interface built with shadcn/ui
- **Fast Performance**: Optimized for speed with lazy loading and code splitting
- **Real-time Updates**: Instant UI updates without page refreshes

### 🔒 Security & Authentication
- **GitHub OAuth**: Secure authentication through GitHub
- **JWT Sessions**: Secure session management with automatic token refresh
- **Private Snippets**: Keep your sensitive code private
- **Access Control**: Granular permissions for snippet visibility

### 💻 Developer Features
- **TypeScript**: Full type safety across the entire codebase
- **Monorepo Structure**: Organized codebase with shared types
- **Modern Tech Stack**: Built with the latest web technologies
- **API Documentation**: Well-documented REST API
- **Database Migrations**: Version-controlled database schema changes

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript with excellent DX
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications

### Backend
- **Bun** - Fast JavaScript runtime and package manager
- **Hono** - Modern web framework for edge computing
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Zod** - Schema validation library
- **JWT** - JSON Web Token authentication

### DevOps & Deployment
- **Cloudflare Workers** - Edge computing platform
- **GitHub Actions** - CI/CD automation
- **Drizzle Kit** - Database migrations and introspection
- **ESLint** - Code linting and formatting

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your system
- [PostgreSQL database](https://www.postgresql.org/) (local or cloud)
- [GitHub OAuth App](https://github.com/settings/developers) configured

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/snippets-library.git
cd snippets-library
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/snippets_library

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
```bash
# Navigate to server directory
cd server

# Run database migrations
bun run db:migrate

# (Optional) Seed the database
bun run db:seed
```

### 5. Start Development
```bash
# Start all services (from root directory)
bun run dev

# Or start individually:
bun run dev:server   # Backend on port 8000
bun run dev:client   # Frontend on port 5173
```

Visit `http://localhost:5173` to see the application!

## 📁 Project Structure

```
snippets-library/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── CreateSnippetForm.tsx
│   │   │   ├── SnippetCard.tsx
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SharedSnippet.tsx
│   │   │   └── ...
│   │   ├── contexts/      # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── UserSettingsContext.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   │   ├── api.ts
│   │   │   ├── languages.ts
│   │   │   └── utils.ts
│   │   └── types/         # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend API server
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   │   ├── auth.ts
│   │   │   └── snippets.ts
│   │   ├── db/            # Database configuration
│   │   │   ├── schema.ts
│   │   │   └── index.ts
│   │   ├── lib/           # Server utilities
│   │   │   ├── auth.ts
│   │   │   └── middleware.ts
│   │   └── index.ts       # Server entry point
│   ├── drizzle/           # Database migrations
│   ├── package.json
│   └── wrangler.jsonc     # Cloudflare Workers config
├── shared/                # Shared TypeScript types
│   ├── src/
│   │   └── types/
│   │       └── index.ts
│   └── package.json
└── package.json           # Root package.json
```

## 🔧 API Reference

### Authentication
- `GET /api/auth/login` - Initiate GitHub OAuth login
- `GET /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Snippets
- `GET /api/snippets` - Get user's snippets (paginated)
- `GET /api/snippets/:id` - Get specific snippet
- `POST /api/snippets` - Create new snippet
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet
- `POST /api/snippets/:id/share` - Generate share link
- `GET /api/snippets/share/:shareId` - Get shared snippet

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 50)
- `language` - Filter by programming language
- `search` - Search in title/description
- `public` - Filter by visibility (true/false)

## 🎯 Usage Examples

### Creating a Snippet
```javascript
// POST /api/snippets
{
  "title": "React Custom Hook",
  "description": "A custom hook for handling local storage",
  "code": "import { useState, useEffect } from 'react';\n\nexport function useLocalStorage(key, defaultValue) {\n  const [value, setValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : defaultValue;\n    } catch (error) {\n      return defaultValue;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.error('Error saving to localStorage:', error);\n    }\n  }, [key, value]);\n\n  return [value, setValue];\n}",
  "language": "javascript",
  "isPublic": true
}
```

### Searching Snippets
```javascript
// GET https://api.snippetslibrary.com/api/snippets?search=react&language=javascript&public=true&page=1&limit=10
```

## 🌟 Features in Detail

### Code Highlighting
- Supports 20+ programming languages
- Automatic language detection
- Multiple themes (light/dark)
- Copy code with syntax preservation
- Line numbers and formatting

### Sharing System
- Generate unique shareable links
- Public snippets accessible without authentication
- SEO-friendly URLs
- Embed-friendly snippet display

### Search & Filtering
- Real-time search across title, description, and code
- Language-based filtering
- Visibility filtering (public/private)
- Date-based sorting
- Pagination for large result sets

### User Experience
- Responsive design for all devices
- Keyboard shortcuts for common actions
- Dark/light theme switching
- Loading states and error handling
- Toast notifications for user feedback

## 🧪 Development

### Available Scripts
```bash
# Development
bun run dev              # Start all services
bun run dev:client       # Start frontend only
bun run dev:server       # Start backend only
bun run dev:shared       # Build shared types in watch mode

# Building
bun run build            # Build all projects
bun run build:client     # Build frontend
bun run build:server     # Build backend
bun run build:shared     # Build shared types

# Database
bun run db:migrate       # Run database migrations
bun run db:reset         # Reset database
bun run db:seed          # Seed database with sample data
bun run db:studio        # Open database studio

# Deployment
bun run deploy:server    # Deploy to Cloudflare Workers
```

### Environment Variables
```bash
# Server (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Client (.env.local)
VITE_API_URL=http://localhost:8000
```

## 📊 Database Schema

### Users Table
- `id` - UUID primary key
- `github_id` - GitHub user ID
- `username` - GitHub username
- `email` - User email
- `name` - Display name
- `avatar_url` - Profile picture URL
- `bio` - User biography
- `ui_theme` - UI theme preference
- `code_theme` - Code highlighting theme
- `created_at` - Account creation date
- `updated_at` - Last update date

### Snippets Table
- `id` - UUID primary key
- `title` - Snippet title
- `description` - Optional description
- `code` - Snippet code content
- `language` - Programming language
- `tags` - JSON array of tags
- `is_public` - Visibility flag
- `share_id` - Unique sharing identifier
- `user_id` - Foreign key to users
- `seo_title` - SEO title for public snippets
- `seo_description` - SEO description
- `seo_keywords` - SEO keywords
- `created_at` - Creation date
- `updated_at` - Last update date

### Sessions Table
- `id` - Session ID
- `user_id` - Foreign key to users
- `access_token` - OAuth access token
- `expires_at` - Session expiration
- `created_at` - Session creation date

## 🚢 Deployment

### Cloudflare Workers (Recommended)
```bash
# Build and deploy
bun run build
bun run deploy:server

# Set environment variables in Cloudflare dashboard
# Configure custom domain if needed
```

### Traditional Hosting
```bash
# Build all projects
bun run build

# Deploy client to static hosting (Vercel, Netlify, etc.)
# Deploy server to any Node.js hosting provider
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Use conventional commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Shiki](https://shiki.style/) for syntax highlighting
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- [Hono](https://hono.dev/) for the lightweight web framework
- [Bun](https://bun.sh/) for the fast JavaScript runtime

## 📞 Support

- Create an [issue](https://github.com/yourusername/snippets-library/issues) for bug reports
- Start a [discussion](https://github.com/yourusername/snippets-library/discussions) for questions
- Check the [wiki](https://github.com/yourusername/snippets-library/wiki) for documentation

---

<p align="center">Built with ❤️ by developers, for developers</p>