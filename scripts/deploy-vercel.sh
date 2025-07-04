#!/bin/bash

# Universal Blog Platform - Vercel Deployment Script

echo "🚀 Starting Vercel deployment for Universal Blog Platform..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project first
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Configure your database (PostgreSQL recommended for production)"
echo "3. Set up Redis for caching"
echo "4. Configure OAuth providers (Google, GitHub)"
echo "5. Add your domain name"
echo ""
echo "🔗 Environment variables to set in Vercel:"
echo "   - DATABASE_URL"
echo "   - REDIS_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - GITHUB_CLIENT_ID"
echo "   - GITHUB_CLIENT_SECRET"
echo "   - OPENAI_API_KEY"
echo ""
echo "📖 See .env.production.template for complete list"
