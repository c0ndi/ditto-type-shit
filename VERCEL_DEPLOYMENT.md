# Vercel Deployment Guide for Ditto2

This guide covers the specific configurations needed to deploy the Ditto2 app with Prisma on Vercel.

## 🔧 Vercel Configuration Applied

### 1. `vercel.json` Configuration

The following optimizations have been added:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-topic",
      "schedule": "* * * * *"
    }
  ],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_SKIP_AUTOINSTALL": "true"
  },
  "installCommand": "yarn install && npx prisma generate"
}
```

### 2. Package.json Build Scripts

Updated build scripts for Vercel:

- `build`: Includes Prisma generation and database push
- `vercel-build`: Specific command for Vercel deployment
- `postinstall`: Ensures Prisma client generation

## 🚀 Deployment Steps

### Step 1: Database Setup

1. **Choose a Database Provider:**
   - **Supabase** (Recommended): PostgreSQL with built-in storage
   - **PlanetScale**: MySQL with branching
   - **Neon**: PostgreSQL with autoscaling

2. **For Supabase (Recommended):**
   ```bash
   # Create a new Supabase project
   # Get your DATABASE_URL and DIRECT_URL from project settings
   ```

### Step 2: Environment Variables

Set these in your Vercel project dashboard:

```bash
# Next.js
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here

# Twitter OAuth
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret

# Database
DATABASE_URL="postgresql://username:password@host:5432/database?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://username:password@host:5432/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cron Security
CRON_SECRET=your-random-cron-secret-string

# Vercel Optimizations
PRISMA_GENERATE_SKIP_AUTOINSTALL=true
```

### Step 3: Supabase Storage Setup

1. **Create Storage Bucket:**

   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('post-images', 'post-images', true);
   ```

2. **Set Up Storage Policies:**

   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload images" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

   -- Allow public access to view images
   CREATE POLICY "Public can view images" ON storage.objects
   FOR SELECT USING (bucket_id = 'post-images');

   -- Allow users to delete their own images
   CREATE POLICY "Users can delete own images" ON storage.objects
   FOR DELETE USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Step 4: Deploy to Vercel

1. **Connect Repository:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

2. **Or use Vercel Dashboard:**
   - Import project from GitHub
   - Set environment variables
   - Deploy

### Step 5: Post-Deployment Setup

1. **Verify Database Schema:**

   ```bash
   # The build process automatically runs:
   # prisma generate && prisma db push
   ```

2. **Test Cron Jobs:**
   - Visit `/admin` to monitor topic generation
   - Cron jobs will start running automatically

3. **Test Image Upload:**
   - Create a test account
   - Upload a photo to verify Supabase storage

## 🔍 Troubleshooting

### Common Issues

1. **Prisma Client Not Generated:**

   ```bash
   # Manually trigger in Vercel
   yarn vercel-build
   ```

2. **Database Connection Issues:**
   - Check `DATABASE_URL` format
   - Ensure connection pooling is enabled
   - Use `DIRECT_URL` for migrations

3. **Cron Jobs Not Running:**
   - Verify `CRON_SECRET` is set
   - Check function logs in Vercel dashboard
   - Ensure cron schedule is valid

4. **Image Upload Failures:**
   - Verify Supabase environment variables
   - Check storage bucket permissions
   - Ensure service role key has storage access

### Performance Optimization

1. **Database Optimization:**
   - Use connection pooling
   - Enable query optimization
   - Monitor slow queries

2. **Image Storage:**
   - Resize images before upload
   - Use WebP format when possible
   - Implement image CDN caching

3. **Function Timeout:**
   - Increase `maxDuration` if needed
   - Optimize API response times
   - Use background processing for heavy tasks

## 📊 Monitoring

### Key Metrics to Monitor

1. **Cron Job Health:**
   - Topic generation success rate
   - Function execution time
   - Error logs

2. **Image Upload Performance:**
   - Upload success rate
   - Average upload time
   - Storage usage

3. **Database Performance:**
   - Query response times
   - Connection pool usage
   - Active connections

### Vercel Dashboard Features

- Function logs and metrics
- Cron job execution history
- Performance monitoring
- Error tracking

## 🔐 Security Considerations

1. **Environment Variables:**
   - Never commit secrets to repository
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Cron Job Security:**
   - Set strong `CRON_SECRET`
   - Monitor for unauthorized requests
   - Rate limit API endpoints

3. **Image Upload Security:**
   - Validate file types and sizes
   - Scan for malicious content
   - Implement usage quotas

## 📝 Additional Notes

- **Database Migrations:** Use `prisma db push` for Vercel (not migrations)
- **File Storage:** Organized in `posts/YYYY/MM/DD/userId/` structure
- **Cron Schedule:** Currently set to every minute for testing
- **Function Timeouts:** Set to 30 seconds for API routes

This configuration ensures optimal performance and reliability for the Ditto2 application on Vercel with Prisma and Supabase.
