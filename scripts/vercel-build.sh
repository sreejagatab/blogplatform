#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Check if generation was successful
if [ $? -ne 0 ]; then
    echo "❌ Prisma generation failed, continuing with build..."
fi

# Build the Next.js application
echo "🔨 Building Next.js application..."
npx next build

echo "✅ Build process completed!"
