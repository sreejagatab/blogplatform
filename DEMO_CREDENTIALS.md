# Demo Login Credentials - Universal Blog Platform

## 🎯 Quick Access Demo Accounts

The Universal Blog Platform includes pre-configured demo accounts to showcase different user roles and permissions. Use these credentials to explore the platform's features.

### 🚀 **Easy Demo Access**
Visit: **http://localhost:3003/demo**

This page provides one-click login for all demo accounts with a visual interface.

---

## 👥 Demo User Accounts

### 🔑 **ADMIN USER**
- **Email:** `admin@blogplatform.com`
- **Role:** `ADMIN`
- **Access Level:** Full platform access
- **Features:**
  - Complete user management
  - All content management (posts, categories, tags)
  - Platform configuration
  - Analytics and reporting
  - AI content features
  - System settings
  - User role management

### 📝 **EDITOR USER**
- **Email:** `editor@blogplatform.com`
- **Role:** `EDITOR` 
- **Access Level:** Content management
- **Features:**
  - Create, edit, and publish posts
  - Manage categories and tags
  - Content analytics
  - AI content assistance
  - SEO optimization tools
  - Content scheduling

### 👁️ **VIEWER USER**
- **Email:** `viewer@blogplatform.com`
- **Role:** `VIEWER`
- **Access Level:** Read-only access
- **Features:**
  - View published content
  - Basic profile management
  - Limited dashboard access
  - Read-only analytics

---

## 🔐 Authentication Methods

### **1. Demo Login (Recommended for Testing)**
- Navigate to: `http://localhost:3003/demo`
- Click on any user card to instantly login
- No password required - demo environment only

### **2. OAuth Login (Production Method)**
The platform supports:
- **Google OAuth** - Use the demo emails with your Google account
- **GitHub OAuth** - Use the demo emails with your GitHub account

*Note: For OAuth to work, you'll need to configure the OAuth providers in the environment variables.*

---

## 🎨 Platform Features by Role

### **Admin Features** 🔑
```
✅ Dashboard Overview
✅ Post Management (Create, Edit, Delete, Bulk Operations)
✅ Category Management (Full CRUD)
✅ User Management
✅ Analytics Dashboard
✅ AI Content Hub
✅ SEO Tools
✅ Platform Integrations
✅ System Settings
```

### **Editor Features** 📝
```
✅ Dashboard Overview
✅ Post Management (Create, Edit, Publish)
✅ Category Management
✅ Content Analytics
✅ AI Content Assistance
✅ SEO Optimization
❌ User Management
❌ System Settings
```

### **Viewer Features** 👁️
```
✅ Basic Dashboard
✅ View Content
✅ Profile Settings
❌ Content Creation
❌ Management Features
❌ Analytics
```

---

## 🧪 Sample Data Included

The demo environment includes:

### **📊 Platforms**
- LinkedIn, Medium, Twitter/X, DEV Community, Hashnode

### **📁 Categories**
- Technology, Business, Lifestyle, Education

### **🏷️ Tags**
- JavaScript, TypeScript, React, Next.js, Node.js, AI, Machine Learning, etc.

### **📝 Sample Posts**
- "The Complete Guide to AI-Powered Content Distribution"
- "Building Your Personal Brand Across Multiple Platforms"
- "Analytics Deep Dive: Understanding Cross-Platform Metrics"

### **🔍 SEO Keywords**
- Web development, JavaScript tutorial, React hooks, Node.js API, TypeScript guide

---

## 🚀 Quick Start Guide

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Seed the Database** (if not already done)
   ```bash
   npm run db:seed
   ```

3. **Access Demo Login**
   - Open: `http://localhost:3003/demo`
   - Choose a user role
   - Click "Login as [ROLE]"

4. **Explore Features**
   - **Admin:** Try `/admin` dashboard
   - **Posts:** Visit `/admin/posts` for content management
   - **Categories:** Check `/admin/categories` for organization
   - **Analytics:** View `/admin/analytics` for insights
   - **AI:** Explore `/admin/ai` for content enhancement

---

## 🔧 Technical Notes

### **Database**
- Uses SQLite for demo (defined in `prisma/schema.prisma`)
- Demo data seeded via `prisma/seed.ts`
- Session management through Prisma

### **Authentication**
- NextAuth.js for OAuth providers
- Demo bypass available for testing
- Role-based access control (RBAC)

### **API Endpoints**
- `/api/demo/login` - Demo authentication
- `/api/admin/*` - Admin-only endpoints
- `/api/posts/*` - Content management
- `/api/analytics/*` - Analytics data

---

## 🎯 What to Test

### **Admin User Testing**
- [ ] Create/edit/delete posts
- [ ] Manage categories
- [ ] View analytics dashboard
- [ ] Try AI content features
- [ ] Test bulk operations
- [ ] Explore user management

### **Editor User Testing**
- [ ] Create and publish content
- [ ] Use rich text editor
- [ ] Try SEO optimization
- [ ] Test content scheduling
- [ ] Verify limited access (no user management)

### **Viewer User Testing**
- [ ] Confirm read-only access
- [ ] View published content
- [ ] Test restricted permissions

---

## 🔗 Key URLs

- **Demo Login:** `http://localhost:3003/demo`
- **Admin Dashboard:** `http://localhost:3003/admin`
- **Public Blog:** `http://localhost:3003/blog`
- **Home Page:** `http://localhost:3003`

---

*🎯 This demo environment showcases the full capabilities of the Universal Blog Platform. For production deployment, proper OAuth configuration and security measures should be implemented.*
