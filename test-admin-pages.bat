@echo off
echo 🚀 Testing Admin Pages Accessibility...
echo.

set BASE_URL=http://localhost:3000

echo Testing Admin Dashboard...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin
echo  - Admin Dashboard

echo Testing Posts Management...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/posts
echo  - Posts Management

echo Testing Content Hub...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/content
echo  - Content Hub

echo Testing AI Content Hub...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/ai
echo  - AI Content Hub

echo Testing Publishing Hub...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/publishing
echo  - Publishing Hub

echo Testing Platform Health...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/health
echo  - Platform Health

echo Testing Scheduler...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/scheduler
echo  - Scheduler

echo Testing Media Library...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/media
echo  - Media Library

echo Testing Users Management...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/users
echo  - Users Management

echo Testing Analytics...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/analytics
echo  - Analytics

echo Testing SEO Tools...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/seo
echo  - SEO Tools

echo Testing AI Insights...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/ai-insights
echo  - AI Insights

echo Testing Platforms...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/platforms
echo  - Platforms

echo Testing Categories...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/categories
echo  - Categories

echo Testing Comments...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/comments
echo  - Comments

echo Testing Email Marketing...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/email
echo  - Email Marketing

echo Testing Notifications...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/notifications
echo  - Notifications

echo Testing Scheduled Content...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/scheduled
echo  - Scheduled Content

echo Testing Settings...
curl -s -o nul -w "%%{http_code}" %BASE_URL%/admin/settings
echo  - Settings

echo.
echo ✅ Test completed!
echo.
echo 📋 Status Code Reference:
echo 200 = Page loads successfully
echo 302/307 = Redirects to authentication (expected)
echo 404 = Page not found (needs to be created)
echo 500 = Server error (needs to be fixed)
echo.
echo 🎯 Next: Use demo login at http://localhost:3000/demo to test clickable elements
pause
