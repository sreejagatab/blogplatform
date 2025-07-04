# Universal Blog Platform Deployment Guide

## Overview

This guide covers deploying the Universal Blog Platform to production environments including cloud platforms, containerization, and configuration management.

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ database
- Redis for caching and sessions
- Email service (SendGrid, AWS SES, etc.)
- Cloud storage (AWS S3, Cloudinary, etc.)
- Domain name and SSL certificate

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SECRET_KEY=your-super-secret-key-here

# Database
DATABASE_URL=postgresql://username:password@host:5432/database
REDIS_URL=redis://username:password@host:6379

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Platform APIs
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/blogplatform
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: blogplatform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

## Cloud Platform Deployments

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Configure Project**
```bash
vercel
```

3. **Set Environment Variables**
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# Add all other environment variables
```

4. **Deploy**
```bash
vercel --prod
```

### AWS Deployment

#### Using AWS App Runner

1. **Create apprunner.yaml**
```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm install
      - npm run build
run:
  runtime-version: 18
  command: npm start
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

2. **Deploy via AWS Console or CLI**
```bash
aws apprunner create-service \
  --service-name blog-platform \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "your-ecr-repo:latest",
      "ImageConfiguration": {
        "Port": "3000"
      }
    }
  }'
```

#### Using ECS with Fargate

1. **Create task definition**
2. **Set up Application Load Balancer**
3. **Configure auto-scaling**
4. **Set up CloudWatch monitoring**

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push container**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/blog-platform
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy blog-platform \
  --image gcr.io/PROJECT-ID/blog-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

1. **Create app.yaml**
```yaml
name: blog-platform
services:
- name: web
  source_dir: /
  github:
    repo: your-username/blog-platform
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
databases:
- name: db
  engine: PG
  version: "14"
```

## Database Setup

### PostgreSQL Configuration

1. **Create database and user**
```sql
CREATE DATABASE blogplatform;
CREATE USER bloguser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE blogplatform TO bloguser;
```

2. **Run migrations**
```bash
npx prisma migrate deploy
```

3. **Seed initial data**
```bash
npx prisma db seed
```

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_posts_status_published ON posts(status, published_at);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_page_views_post ON page_views(post_id);
CREATE INDEX idx_page_views_created ON page_views(created_at);
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

## Monitoring and Logging

### Application Monitoring

1. **Sentry for Error Tracking**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

2. **Health Check Endpoint**
```javascript
// pages/api/health.js
export default async function handler(req, res) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis connection
    await redis.ping()
    
    res.status(200).json({ status: 'healthy' })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message })
  }
}
```

### Log Management

```javascript
// lib/logger.js
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

## Performance Optimization

### Caching Strategy

1. **Redis Caching**
```javascript
// lib/cache.js
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCached(key, fallback, ttl = 3600) {
  try {
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)
    
    const data = await fallback()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Cache error:', error)
    return await fallback()
  }
}
```

2. **CDN Configuration**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/fetch/',
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Security Checklist

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure security headers (CSP, HSTS, etc.)
- [ ] Set up rate limiting
- [ ] Enable CSRF protection
- [ ] Validate and sanitize all inputs
- [ ] Use environment variables for secrets
- [ ] Enable database connection encryption
- [ ] Set up proper CORS policies
- [ ] Implement proper authentication and authorization
- [ ] Regular security updates and patches

## Backup Strategy

### Database Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
```

### File Backups

```bash
# Backup uploaded files
aws s3 sync ./public/uploads s3://your-backup-bucket/uploads/
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check connection string format
   - Verify database server is running
   - Check firewall settings

2. **Memory Issues**
   - Monitor memory usage
   - Optimize database queries
   - Implement proper caching

3. **Performance Issues**
   - Enable database query logging
   - Use APM tools
   - Optimize images and assets

### Useful Commands

```bash
# Check application logs
docker logs blog-platform-app

# Monitor resource usage
docker stats

# Database connection test
psql $DATABASE_URL -c "SELECT version();"

# Redis connection test
redis-cli -u $REDIS_URL ping
```

## Support

For deployment support:
- Documentation: https://docs.yourdomain.com
- Support: support@yourdomain.com
- Community: https://community.yourdomain.com
