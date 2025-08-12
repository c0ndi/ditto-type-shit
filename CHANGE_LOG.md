# Change Log

This file documents all changes made to the Ditto2 Daily Photo Challenge application.

## 12/08/2025 15:50

### Post Creation System Implementation

- Added complete post creation functionality with image upload to Supabase storage - 12/08/2025 15:38
- Created Supabase client configuration (`src/lib/supabase.ts`) with domain-independent storage paths - 12/08/2025 15:36
- Implemented tRPC post router (`src/server/api/routers/post.router.ts`) with create, fetch, and validation endpoints - 12/08/2025 15:37
- Built post creation form component (`src/components/features/create-post-form.tsx`) with drag-and-drop image upload, zod validation, and useForm integration - 12/08/2025 15:38
- Updated homepage (`src/app/page.tsx`) with post creation form integration and improved landing page for unauthenticated users - 12/08/2025 15:40
- Enhanced environment configuration (`src/env.js`) to include Supabase and cron job environment variables - 12/08/2025 15:36

### Vercel Cron Job System

- Created Vercel cron configuration (`vercel.json`) to generate new topics every 1 minute for testing purposes - 12/08/2025 15:45
- Implemented topic generation API endpoint (`src/app/api/cron/generate-topic/route.ts`) with security validation and duplicate prevention - 12/08/2025 15:45
- Added manual topic generation endpoint (`src/app/api/admin/test-topic/route.ts`) for development testing - 12/08/2025 15:46
- Created topic management tRPC router (`src/server/api/routers/topic.router.ts`) with comprehensive topic querying and statistics - 12/08/2025 15:47
- Built admin dashboard (`src/app/admin/page.tsx`) for monitoring topics and testing cron functionality - 12/08/2025 15:48
- Updated main tRPC router (`src/server/api/root.ts`) to include post and topic routers - 12/08/2025 15:37

### Dependencies Added

- react-hook-form and @hookform/resolvers for form handling with zod validation
- @supabase/supabase-js for image storage and management
- date-fns for date formatting in the admin dashboard
- shadcn/ui components: form, input, label, textarea, card, badge

### Technical Features Implemented

- Domain-independent image storage with organized directory structure (`posts/YYYY/MM/DD/userId/`)
- File validation (type, size) with 5MB limit and JPEG/PNG/WebP support
- Base64 image conversion for API transmission
- Drag-and-drop image upload with preview functionality
- One post per user per topic enforcement at database and API level
- Topic generation with 12 sample topics for testing
- Automatic cleanup of old topics (keeps last 100)
- Real-time topic status monitoring
- Development-only manual topic generation
- Proper error handling and user feedback throughout the application

### Vercel Deployment Optimizations

- Updated `vercel.json` with Prisma-specific configurations including install commands and function settings - 12/08/2025 15:52
- Optimized Prisma client generation with library engine type and proper output path - 12/08/2025 15:53
- Enhanced package.json build scripts for Vercel deployment with `vercel-build` command - 12/08/2025 15:52
- Created comprehensive Vercel deployment guide (`VERCEL_DEPLOYMENT.md`) with database setup and environment variables - 12/08/2025 15:53
- Added `.vercelignore` file to exclude unnecessary files from deployment - 12/08/2025 15:52
- Configured database connection optimizations for serverless environment - 12/08/2025 15:54

---
