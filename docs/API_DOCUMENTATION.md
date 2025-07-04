# Universal Blog Platform API Documentation

## Overview

The Universal Blog Platform provides a comprehensive REST API for managing blog content, user accounts, analytics, email campaigns, and cross-platform publishing.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Content Management API

### Posts

#### Create Post
```http
POST /api/posts
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "Post content here...",
  "excerpt": "Brief description",
  "status": "DRAFT|PUBLISHED",
  "categoryId": "category-uuid",
  "tags": ["tag1", "tag2"],
  "featuredImage": "image-url",
  "seoTitle": "SEO optimized title",
  "seoDescription": "SEO description"
}
```

#### Get Posts
```http
GET /api/posts?page=1&limit=10&status=PUBLISHED&category=tech
```

#### Update Post
```http
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Post
```http
DELETE /api/posts/{id}
```

### Categories

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech-related posts",
  "slug": "technology"
}
```

#### Get Categories
```http
GET /api/categories
```

## Platform Publishing API

### Publish to Platforms
```http
POST /api/publishing/distribute
Content-Type: application/json

{
  "postId": "post-uuid",
  "platforms": ["twitter", "linkedin", "facebook"],
  "scheduledAt": "2024-01-15T10:00:00Z",
  "customizations": {
    "twitter": {
      "content": "Custom Twitter content"
    }
  }
}
```

### Get Publishing Status
```http
GET /api/publishing/status/{jobId}
```

### Platform Management
```http
GET /api/platforms
POST /api/platforms/{platform}/authenticate
DELETE /api/platforms/{platform}/disconnect
```

## AI-Powered Features API

### Content Optimization
```http
POST /api/ai/optimize
Content-Type: application/json

{
  "content": "Your blog post content",
  "title": "Post title",
  "platform": "twitter",
  "targetAudience": "developers",
  "goals": ["engagement", "seo"],
  "includeHashtags": true
}
```

### SEO Analysis
```http
POST /api/ai/seo-analyze
Content-Type: application/json

{
  "title": "Post title",
  "content": "Post content",
  "targetKeywords": ["keyword1", "keyword2"]
}
```

### Content Ideas Generation
```http
POST /api/ai/content-ideas
Content-Type: application/json

{
  "topic": "web development",
  "industry": "technology",
  "contentType": "blog",
  "count": 10
}
```

### Hashtag Generation
```http
POST /api/ai/hashtags
Content-Type: application/json

{
  "content": "Your content",
  "platform": "instagram",
  "maxHashtags": 10,
  "includeNiche": true
}
```

## Analytics API

### Get Analytics Overview
```http
GET /api/analytics?timeframe=30d&postId=optional-post-id
```

### Cross-Platform Analytics
```http
GET /api/analytics/cross-platform?timeframe=7d
```

### Real-time Analytics
```http
GET /api/analytics/realtime
```

### Export Analytics
```http
GET /api/analytics/export?format=csv&timeframe=30d
```

### Analytics Insights
```http
GET /api/analytics/insights?timeframe=30d&includeAI=true
```

## Email & Newsletter API

### Newsletter Subscription
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "tags": ["developer", "javascript"],
  "preferences": {
    "frequency": "weekly",
    "topics": ["web-dev", "tutorials"]
  }
}
```

### Unsubscribe
```http
DELETE /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "unsubscribe-token"
}
```

### Email Campaigns
```http
POST /api/email/campaigns
Content-Type: application/json

{
  "name": "Weekly Newsletter",
  "templateId": "template-uuid",
  "subject": "This Week in Tech",
  "recipientFilters": {
    "tags": ["developer"],
    "subscribed": true
  },
  "scheduledAt": "2024-01-15T09:00:00Z"
}
```

### Send Campaign
```http
PUT /api/email/campaigns
Content-Type: application/json

{
  "campaignId": "campaign-uuid",
  "action": "send"
}
```

### Email Templates
```http
GET /api/email/templates
POST /api/email/templates
PUT /api/email/templates/{id}
DELETE /api/email/templates/{id}
```

## Media Management API

### Upload Media
```http
POST /api/media/upload
Content-Type: multipart/form-data

files: [file1, file2]
folder: "blog"
tags: "image,featured"
alt: "Alt text for images"
```

### Get Media Files
```http
GET /api/media/upload?folder=blog&type=image&search=keyword&page=1&limit=20
```

### Update Media
```http
PUT /api/media/manage
Content-Type: application/json

{
  "id": "media-uuid",
  "alt": "Updated alt text",
  "tags": ["updated", "tags"],
  "folder": "new-folder"
}
```

### Delete Media
```http
DELETE /api/media/manage
Content-Type: application/json

{
  "fileIds": ["media-uuid-1", "media-uuid-2"]
}
```

### Media Statistics
```http
GET /api/media/manage?action=stats
```

## User Management API

### Get User Profile
```http
GET /api/users/profile
```

### Update Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "User bio",
  "website": "https://example.com"
}
```

### Notification Settings
```http
GET /api/users/notifications
PUT /api/users/notifications
```

## Real-time Features

### WebSocket Connection
```javascript
const socket = io('wss://your-domain.com', {
  auth: {
    token: 'your-jwt-token'
  }
})

// Join post for real-time comments
socket.emit('join-post', postId)

// Listen for new comments
socket.on('comment-added', (data) => {
  console.log('New comment:', data)
})

// Listen for analytics updates
socket.emit('join-admin-analytics')
socket.on('analytics-update', (data) => {
  console.log('Analytics update:', data)
})
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate-limited based on user role:

- **Free users**: 100 requests/hour
- **Pro users**: 1,000 requests/hour
- **Enterprise**: 10,000 requests/hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

```http
GET /api/posts?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

## Webhooks

Configure webhooks to receive real-time notifications:

```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["post.published", "comment.created"],
  "secret": "webhook-secret"
}
```

### Webhook Events

- `post.published`: New post published
- `post.updated`: Post updated
- `comment.created`: New comment added
- `user.subscribed`: New newsletter subscription
- `campaign.sent`: Email campaign sent

## SDK Examples

### JavaScript/Node.js
```javascript
import { BlogPlatformAPI } from '@blog-platform/sdk'

const api = new BlogPlatformAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://your-domain.com/api'
})

// Create a post
const post = await api.posts.create({
  title: 'My Post',
  content: 'Post content...'
})

// Publish to platforms
await api.publishing.distribute(post.id, ['twitter', 'linkedin'])
```

### Python
```python
from blog_platform import BlogPlatformAPI

api = BlogPlatformAPI(
    api_key='your-api-key',
    base_url='https://your-domain.com/api'
)

# Create a post
post = api.posts.create(
    title='My Post',
    content='Post content...'
)

# Get analytics
analytics = api.analytics.get_overview(timeframe='30d')
```

## Support

For API support and questions:

- Documentation: https://docs.your-domain.com
- Support: support@your-domain.com
- Status Page: https://status.your-domain.com
