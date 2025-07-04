# Development Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Redis server running (optional, for caching)

## Quick Start

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Setup database:**
```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth.js
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)

### OAuth Providers (at least one required)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

### Optional
- `REDIS_URL` - Redis connection string for caching
- `OPENAI_API_KEY` - For AI features
- `UPLOADTHING_SECRET` - For file uploads

## Database Setup

1. Create a PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`
3. Run `npm run db:push` to create tables
4. Run `npm run db:seed` to add sample data

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Create migration
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests

# Code Quality
npm run lint            # Lint code
npm run type-check      # TypeScript check
```

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router
│   ├── (auth)/         # Authentication pages
│   ├── admin/          # Admin panel
│   ├── api/            # API routes
│   └── blog/           # Blog pages
├── components/         # React components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── blog/           # Blog-specific components
│   └── admin/          # Admin components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## Features Implementation Status

### ✅ Completed
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] Prisma database setup
- [x] NextAuth.js authentication
- [x] Basic UI components
- [x] Infinite scroll blog feed
- [x] PWA configuration
- [x] Dark/light theme support

### 🚧 In Progress
- [ ] Admin panel
- [ ] AI integration (OpenAI/Claude)
- [ ] Platform integrations
- [ ] Analytics dashboard
- [ ] Content management
- [ ] SEO optimization tools

### 📋 Planned
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] API marketplace
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Troubleshooting

### Common Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

**OAuth login not working:**
- Check OAuth credentials are correct
- Verify redirect URLs match exactly
- Ensure OAuth apps are enabled

**Build errors:**
- Run `npm run type-check` to find TypeScript errors
- Check all environment variables are set
- Clear `.next` folder and rebuild

### Getting Help

- Check the [documentation](./docs/)
- Open an issue on GitHub
- Join our Discord community
- Email support@universalblogplatform.com
