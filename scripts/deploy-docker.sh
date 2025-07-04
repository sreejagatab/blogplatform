#!/bin/bash

# Universal Blog Platform - Docker Deployment Script

echo "🐳 Starting Docker deployment for Universal Blog Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

if [ $? -ne 0 ]; then
    echo "❌ Docker deployment failed."
    exit 1
fi

echo "✅ Docker deployment successful!"
echo ""
echo "🌐 Application is running at: http://localhost"
echo "📊 Database is running at: localhost:5432"
echo "🔴 Redis is running at: localhost:6379"
echo ""
echo "📋 Next steps:"
echo "1. Wait for all services to start (may take a few minutes)"
echo "2. Run database migrations: docker-compose exec app npx prisma migrate deploy"
echo "3. Seed the database: docker-compose exec app npx prisma db seed"
echo "4. Configure your environment variables in docker-compose.yml"
echo ""
echo "🔍 Check logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
