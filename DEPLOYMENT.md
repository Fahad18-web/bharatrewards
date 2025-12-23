# Deployment Guide: Vercel + Railway

This guide explains how to deploy the Solve2Win app using **Vercel** (frontend) and **Railway** (backend).

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Vercel         │  ───►   │  Railway        │  ───►   │  Supabase       │
│  (Frontend)     │  API    │  (Backend)      │  DB     │  (Database)     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     React/Vite                 Express.js                PostgreSQL
```

---

## Prerequisites

1. [Vercel account](https://vercel.com/signup)
2. [Railway account](https://railway.app/)
3. [Supabase project](https://supabase.com/) (already configured)
4. GitHub repository with your code

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will detect the monorepo - select the `server` folder as root

### 1.2 Configure Railway Settings

In your Railway project settings:

**Root Directory:** `server`

**Build Command:** `npm install`

**Start Command:** `npm start`

### 1.3 Set Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT
JWT_SECRET=your-production-jwt-secret

# CORS - Add your Vercel URL after deploying frontend
FRONTEND_URL=https://your-app.vercel.app

# Production settings
TRUST_PROXY=1
RATE_LIMIT_MAX=600
AUTH_RATE_LIMIT_MAX=60
```

### 1.4 Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a Railway URL like `your-app.up.railway.app`
3. (Optional) Add a custom domain

**Note your Railway URL** - you'll need it for the frontend deployment.

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository

### 2.2 Configure Vercel Settings

**Framework Preset:** Vite

**Root Directory:** `client`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

### 2.3 Set Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://your-app.up.railway.app/api
```

Replace `your-app.up.railway.app` with your actual Railway URL from Step 1.4.

### 2.4 Deploy

Click **Deploy**. Vercel will build and deploy your frontend.

---

## Step 3: Update CORS on Railway

After deploying to Vercel, go back to Railway and update the `FRONTEND_URL`:

```env
FRONTEND_URL=https://your-app.vercel.app
```

If you have a custom domain, add it to `CORS_ALLOWED_ORIGINS`:

```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Step 4: Custom Domains (Optional)

### Vercel Custom Domain

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Configure DNS as instructed

### Railway Custom Domain

1. Go to your Railway project → **Settings** → **Networking**
2. Add custom domain (e.g., `api.yourdomain.com`)
3. Configure DNS as instructed

---

## Environment Variables Summary

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-app.up.railway.app/api` |

### Backend (Railway)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets this) | Auto |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `FRONTEND_URL` | Vercel frontend URL | Yes |
| `CORS_ALLOWED_ORIGINS` | Additional allowed origins | Optional |
| `TRUST_PROXY` | Trust proxy headers | `1` |

---

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. Include protocol (`https://`)
3. Check Railway logs for "CORS blocked origin" messages

### 502/504 Errors

1. Check Railway logs for errors
2. Verify all environment variables are set
3. Ensure Supabase credentials are correct

### Build Failures

**Vercel:**
- Check that `client` folder has correct `package.json`
- Verify Vite build succeeds locally

**Railway:**
- Check that `server` folder has correct `package.json`
- Verify Node.js version compatibility

### Health Check

Test your backend is running:
```bash
curl https://your-app.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

---

## Local Development

For local development with the deployed backend:

```bash
# In client folder, create .env.local
VITE_API_URL=http://localhost:3001/api

# Run frontend
cd client && npm run dev

# Run backend (in another terminal)
cd server && npm run dev
```

---

## Costs

### Vercel (Frontend)
- **Hobby (Free):** Good for personal projects
- **Pro ($20/mo):** For teams and production apps

### Railway (Backend)
- **Trial:** $5 free credits
- **Hobby ($5/mo):** 8GB RAM, 8 vCPU
- **Pro:** Usage-based pricing

Both platforms offer generous free tiers suitable for launching your app!
