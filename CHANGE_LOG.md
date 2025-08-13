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

### Cron Schedule and Admin Panel Enhancements

- Updated Vercel cron schedule from every minute to every 2 days at midnight (0 0 _/2 _ \*) - 12/08/2025 15:58
- Enhanced admin dashboard with comprehensive topic management and pagination - 12/08/2025 15:57
- Added detailed topic view with keywords display, creation dates, and topic IDs - 12/08/2025 15:57
- Implemented pagination controls for browsing all generated topics - 12/08/2025 15:57
- Added cron schedule explanation and configuration guidance in admin panel - 12/08/2025 15:58
- Improved topic statistics display with enhanced formatting and additional metrics - 12/08/2025 15:57

### Beautiful Sign-In Page

- Created comprehensive sign-in page (`src/app/signin/page.tsx`) with attractive design and Twitter OAuth integration - 12/08/2025 16:00
- Implemented gradient backgrounds and modern UI with glassmorphism effects - 12/08/2025 16:00
- Added feature showcase section highlighting daily challenges, rewards, community, and AI validation - 12/08/2025 16:00
- Included prominent Twitter sign-in button with proper branding and explanation - 12/08/2025 16:00
- Added responsive design that works across all device sizes - 12/08/2025 16:00
- Implemented automatic redirect for already authenticated users - 12/08/2025 16:00
- Added loading states and proper Suspense boundaries for better UX - 12/08/2025 16:00

### Comprehensive Profile System

- Enhanced user router with complete profile data including stats, posts, and achievements - 12/08/2025 16:05
- Created comprehensive ProfileView component with tabbed interface for overview, posts, activity, and achievements - 12/08/2025 16:07
- Added user statistics dashboard with engagement metrics, streaks, and ranking system - 12/08/2025 16:07
- Implemented profile header with avatar, user info, rewards, reputation, and rank display - 12/08/2025 16:07
- Added posts gallery with image display, topic information, and engagement statistics - 12/08/2025 16:07
- Created activity tracking with performance stats, streak information, and recent activity metrics - 12/08/2025 16:07
- Built achievements system with progress tracking for various milestones and badges - 12/08/2025 16:07
- Updated profile page to use new ProfileView component and removed old test component - 12/08/2025 16:09
- Added proper API endpoints for user profile, stats, activity, and public profile viewing - 12/08/2025 16:05

### Testing Tools for Development

- Added delete user account functionality to admin panel for complete user data removal - 12/08/2025 16:12
- Implemented comprehensive data deletion including posts, votes, comments, stats, wallets, and reward transactions - 12/08/2025 16:12
- Added double confirmation dialogs to prevent accidental account deletion - 12/08/2025 16:12
- Created automatic sign-out and redirect to signin page after account deletion - 12/08/2025 16:12
- Added warning section in admin panel explaining the delete functionality and use cases - 12/08/2025 16:12
- Designed for testing complete user workflows with clean slate reset capability - 12/08/2025 16:12

### Top Navigation System

- Created top navigation component (`src/components/views/navigation/top-navigation.tsx`) with user dropdown menu - 12/08/2025 16:48
- Added user avatar display, profile link, and sign out functionality in dropdown - 12/08/2025 16:48
- Integrated navigation into main layout (`src/app/layout.tsx`) for consistent site-wide navigation - 12/08/2025 16:48
- Implemented responsive design with camera icon brand logo and mobile-optimized dropdown - 12/08/2025 16:48
- Added loading states for session management and fallback for unauthenticated users - 12/08/2025 16:48
- Installed dropdown-menu component from shadcn/ui for proper dropdown functionality - 12/08/2025 16:48

### Post Form Refactoring & UX Improvements

- Refactored create-post-form into modular sub-components for better maintainability - 12/08/2025 16:52
- Created organized folder structure with separate components for topic-info, image-upload, submit-button, and status messages - 12/08/2025 16:52
- Implemented server-side post status checking to eliminate client-side loading states and layout shifts - 12/08/2025 16:52
- Added server-queries module for prefetching post status and topic data on the server - 12/08/2025 16:52
- Separated client and server logic: main form as server component, interactive parts as client components - 12/08/2025 16:52
- Improved loading states with dedicated upload progress display and no layout shifting - 12/08/2025 16:52
- Enhanced form submission flow with router.refresh() for immediate state updates after posting - 12/08/2025 16:52
- Created centralized component exports for better code organization and imports - 12/08/2025 16:52
- Eliminated client-side topic fetching and post status checking for better performance and UX - 12/08/2025 16:52

### Database Seeding System

- Created comprehensive database seeder (`src/lib/database-seeder.ts`) for generating realistic test data - 12/08/2025 16:55
- Generated 30+ random users with Twitter-style profiles, avatars, and unique usernames/display names - 12/08/2025 16:55
- Created 10 diverse photo challenge topics with keywords for AI recognition - 12/08/2025 16:55
- Generated 180+ posts across all topics with AI descriptions, validation statuses, and engagement metrics - 12/08/2025 16:55
- Created thousands of realistic votes, comments, and user interactions - 12/08/2025 16:55
- Generated comprehensive user statistics including streaks, engagement rates, and achievement data - 12/08/2025 16:55
- Added reward transactions, post views, and optional wallet connections for complete user profiles - 12/08/2025 16:55
- Implemented API endpoint (`/api/admin/seed-database`) with seed, clear, and reset operations - 12/08/2025 16:55
- Added database seeding tools to admin panel with three operation modes (seed, clear, reset) - 12/08/2025 16:55
- Created clear database functionality to remove all data except current user for clean testing - 12/08/2025 16:55
- Added detailed statistics display showing exactly what data gets created during seeding - 12/08/2025 16:55

### Post Feed System

- Created server-side query function (`getTodaysPosts`) for fetching today's posts with full user and engagement data - 12/08/2025 17:00
- Built PostCard component with user avatars, engagement metrics, and reputation indicators - 12/08/2025 17:00
- Added PostFeed component displaying posts in responsive grid layout sorted by creation date - 12/08/2025 17:00
- Integrated feed into homepage below create post form for seamless user experience - 12/08/2025 17:00
- Added engagement indicators (votes, comments, rewards) and user reputation display - 12/08/2025 17:00
- Created responsive design supporting mobile, tablet, and desktop layouts - 12/08/2025 17:00
- Added "Hot" and "Popular" badges for high-engagement posts - 12/08/2025 17:00
- Implemented empty state when no posts exist for today's challenge - 12/08/2025 17:00
- Enhanced homepage layout with wider container to accommodate grid layout - 12/08/2025 17:00

### tRPC Architecture Improvement

- Refactored server components to use tRPC procedures instead of direct database calls - 12/08/2025 17:05
- Updated CreatePostForm to use `api.post.getActiveTopicWithPostStatus()` tRPC procedure - 12/08/2025 17:05
- Updated PostFeed to use `api.post.getTodaysPosts()` tRPC procedure - 12/08/2025 17:05
- Maintained proper separation between server-side tRPC calls and client-side queries - 12/08/2025 17:05
- Ensured all data fetching goes through tRPC layer for consistency and type safety - 12/08/2025 17:05

### Post Interaction System

- Created comprehensive tRPC queries for post interactions (voting, commenting, detailed fetching) - 12/08/2025 17:08
- Added PostProvider with React Context for centralized post state management - 12/08/2025 17:08
- Implemented optimistic updates for voting with automatic rollback on errors - 12/08/2025 17:08
- Created usePostVoting hook with upvote/downvote functionality and self-vote prevention - 12/08/2025 17:08
- Built usePostComments hook with infinite pagination and optimistic comment creation - 12/08/2025 17:08
- Added usePostDetails hook for fetching individual post data with caching - 12/08/2025 17:08
- Implemented dual-query system: fast post loading + parallel comments loading for better UX - 12/08/2025 17:08
- Created PostDetail demo component showcasing complete interaction functionality - 12/08/2025 17:08
- Added proper error handling and loading states throughout the interaction system - 12/08/2025 17:08
- Designed system to prevent UI blocking when comments are loading - 12/08/2025 17:08

### PostProvider Architecture Improvement

- Refactored PostProvider to use custom hooks instead of duplicating tRPC logic - 12/08/2025 17:10
- PostProvider now properly composes usePostDetails, usePostVoting, and usePostComments hooks - 12/08/2025 17:10
- Eliminated code duplication between provider and individual hooks - 12/08/2025 17:10
- Simplified PostProvider interface by removing initial data requirements - 12/08/2025 17:10
- Better separation of concerns: hooks handle tRPC logic, provider handles composition - 12/08/2025 17:10

### Fixed Vote Count Optimistic Updates

- Fixed issue where vote counts weren't updating immediately when clicking upvote/downvote - 12/08/2025 17:15
- Added optimistic updates to post vote counts in usePostVoting hook - 12/08/2025 17:15
- Vote changes now update both individual post data and post feed data immediately - 12/08/2025 17:15
- Created PostCardWithVoting component that includes interactive voting buttons - 12/08/2025 17:15
- Updated PostFeed to use interactive post cards instead of static ones - 12/08/2025 17:15
- Added comprehensive error handling to revert optimistic updates if voting fails - 12/08/2025 17:15
- Vote counts now show real-time changes while maintaining data consistency - 12/08/2025 17:15

### Removed Redundant Vote Count Fields (Architecture Improvement)

- Removed redundant `upvotes` and `downvotes` fields from Post model schema - 12/08/2025 17:25
- Vote counts now calculated dynamically from Vote table relations - 12/08/2025 17:25
- Eliminates data consistency issues between vote records and cached counts - 12/08/2025 17:25
- Simplified votePost mutation to only manage Vote records - 12/08/2025 17:25
- Updated getTodaysPosts and getById queries to calculate vote counts on-the-fly - 12/08/2025 17:25
- Single source of truth: all vote data now comes from Vote table only - 12/08/2025 17:25
- Database migration completed to remove deprecated vote count columns - 12/08/2025 17:25

### Fixed Optimistic Updates in Post Feed

- Fixed PostCardContent to read live data from tRPC cache instead of static props - 12/08/2025 17:35
- Optimistic vote updates now work correctly in the main post feed on homepage - 12/08/2025 17:35
- Vote counts update instantly when clicking upvote/downvote buttons in feed - 12/08/2025 17:35
- Component now uses getTodaysPosts query data to reflect real-time cache changes - 12/08/2025 17:35
- Maintains fallback to original prop data for reliability - 12/08/2025 17:35

### Post Detail Skeleton Components

- Created PostHeaderSkeleton component matching the structure of PostHeader with loading placeholders - 12/27/2024 13:55
- Created PostImageSkeleton component matching the aspect ratio and structure of PostImage - 12/27/2024 13:55
- Enhanced ContentSkeleton to combine both PostHeader and PostImage skeleton components - 12/27/2024 13:55
- Added proper loading animations and consistent styling across all skeleton components - 12/27/2024 13:55
- Skeleton components provide smooth loading experience while posts are being fetched - 12/27/2024 13:55

### BlurHash Image System Implementation

- **Installed BlurHash dependencies**: `blurhash` and `sharp` packages for image processing - 12/08/2025 23:45
- **Created image processing utilities** (`src/lib/image-processing.ts`):
  - `generateBlurHash()` - Creates BlurHash strings from image buffers
  - `generateBlurImage()` - Creates small blur images for immediate placeholders
  - `processImageForBlur()` - Processes images for both BlurHash and blur images
  - `getBlurImagePath()` - Utility to generate blur image paths with \_blur suffix
- **Enhanced Supabase storage functions** (`src/lib/supabase.ts`):
  - Updated `uploadPostImage()` to generate and upload blur images alongside originals
  - Added `getPostBlurImageUrl()` to retrieve blur image URLs
  - Updated `deletePostImage()` to remove both original and blur images
  - Maintained backward compatibility with existing image URL structure
- **Created blur image utilities** (`src/lib/blur-image-utils.ts`):
  - Helper functions for frontend blur image integration
  - Example React component usage patterns
  - CSS-based blur background utilities
- **Image storage structure**: Original images maintain existing paths, blur images saved with `_blur` suffix
- **No database changes required**: Blur images accessed dynamically using existing imageKey field

### React-BlurHash Implementation with Database Storage

- **Installed react-blurhash package**: Professional BlurHash decoding component for React - 12/09/2025 00:10
- **Added blurHash field to Post model**: Stores BlurHash strings in database for instant placeholder rendering
- **Simplified image processing** (`src/lib/image-processing.ts`):
  - Removed blur image generation, now only generates BlurHash strings
  - Optimized processing with smaller resize dimensions (400x300)
  - Uses BlurHash configuration for consistent quality
- **Updated Supabase storage** (`src/lib/supabase.ts`):
  - Removed blur image storage and URLs
  - Now generates BlurHash during upload and returns string
  - Simplified cleanup and error handling
- **Created PostBlurImage component** (`src/components/shared/post-blur-image.tsx`):
  - Uses react-blurhash Blurhash component for instant placeholder rendering
  - Progressive loading from BlurHash to full image
  - Built-in loading states and smooth transitions
  - No additional image storage required
- **Updated existing components**:
  - All post image displays now use BlurHash placeholders
  - Database stores BlurHash strings instead of blur image paths
  - Better performance with instant placeholder rendering
- **Benefits**: Professional BlurHash implementation, reduced storage usage, instant placeholders, better perceived performance

---
