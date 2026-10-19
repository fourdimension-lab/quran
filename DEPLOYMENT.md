# Deployment Guide — Al-Quran Platform

This guide outlines deployment steps to host the Al-Quran web platform on Vercel, Supabase, or any Docker/Node.js host.

---

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run the migration script:
   - File: `supabase/migrations/20261019_initial_schema.sql`
3. Populate initial seed reference data:
   - File: `supabase/seed.sql`
4. Copy your project URL and public Anon key from **Project Settings -> API**.

---

## 2. Environment Variables Configuration

Create a `.env.local` or configure deployment environment variables:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Provider Configuration (Optional, server-side only)
AI_PROVIDER=gemini # 'gemini' | 'openai' | 'groq'
AI_API_KEY=your-api-key
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

---

## 3. Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Configure Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `AI_API_KEY`).
5. Click **Deploy**. Vercel will automatically run `npm run build` with Turbopack and static page generation.

---

## 4. Self-Hosted Docker Deployment

A production container can be built with standard Node 24:

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 5. Verification Checklist

- [ ] All 114 Surahs load in the Quran Reader (`/read/1` to `/read/114`).
- [ ] Word-by-word popovers open with correct root letters and Bangla/English translations.
- [ ] Tafsir drawer opens with Ibn Kathir and Ahsanul Bayaan entries.
- [ ] Audio recitation plays and auto-scrolls to the active Ayah.
- [ ] AI Study Assistant generates grounded references with fatwa disclaimers.
- [ ] Bookmarks and private notes persist in localStorage and sync with Supabase.
