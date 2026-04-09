# AEGIS Cloud Deployment Guide

## Overview
This guide will deploy your AEGIS system to the cloud using:
- **Render** for Python backend
- **Vercel** for React frontend

Total time: ~15-20 minutes

---

## Prerequisites
- GitHub account (free)
- Render account (free)
- Vercel account (free)

---

## Step 1: Push Code to GitHub

### 1.1 Create a GitHub repository

1. Go to https://github.com/new
2. Name it: `aegis-disaster-system`
3. Make it **Public** (required for free deployments)
4. Click "Create repository"

### 1.2 Push your code

```bash
cd /c/Users/Dell/OneDrive/Desktop/AEGIS-DISASTER-SYSTEM

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial AEGIS disaster response system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aegis-disaster-system.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2: Deploy Backend to Render

### 2.1 Connect Render to GitHub

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Select "Deploy an existing Git repository"
4. Search for `aegis-disaster-system` and select it
5. Click "Connect"

### 2.2 Configure the service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `aegis-backend` |
| **Environment** | `Python 3` |
| **Region** | `us-east-1` (or nearest to you) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.server:app --bind 0.0.0.0:$PORT` |
| **Root Directory** | `backend` |

### 2.3 Add Environment Variables

Click "Advanced" and add:

```
ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

(You'll update this after deploying frontend)

### 2.4 Deploy

Click "Create Web Service" and wait ~3-5 minutes for deployment.

**Note your backend URL**: It will be something like `https://aegis-backend-xxxx.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Vercel to GitHub

1. Go to https://vercel.com and sign up
2. Click "Add New..." → "Project"
3. Search for `aegis-disaster-system` and select it
4. Click "Import"

### 3.2 Configure framework

- **Framework Preset**: Select `Vite`
- **Root Directory**: `frontend/aegis-ui`
- Click "Continue"

### 3.3 Add Environment Variables

Add these environment variables in Vercel:

```
VITE_API_URL=https://aegis-backend-xxxx.onrender.com
VITE_WS_URL=wss://aegis-backend-xxxx.onrender.com
```

(Replace with your actual Render backend URL)

### 3.4 Deploy

Click "Deploy" and wait ~2-3 minutes.

**Note your frontend URL**: It will be something like `https://aegis-ui.vercel.app`

---

## Step 4: Update Backend CORS

Now that you have the frontend URL:

1. Go back to your Render backend service
2. Go to "Environment"
3. Update `ALLOWED_ORIGINS` to your Vercel frontend URL:
   ```
   https://your-vercel-frontend.vercel.app
   ```
4. The service will automatically redeploy

---

## Step 5: Test the Deployment

1. Visit your frontend URL: `https://your-vercel-frontend.vercel.app`
2. Check if it connects to the backend
3. You should see the AEGIS system loading

### Troubleshooting

**Frontend shows error "Cannot connect to backend"**:
- Check that backend URL in Vercel environment variables is correct
- Make sure backend environment variable includes the frontend URL
- Wait a few minutes for changes to propagate

**WebSocket connection fails**:
- Use `wss://` (secure WebSocket) instead of `ws://` in production
- Render automatically handles this for you

---

## Final URLs

After successful deployment, you'll have:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://aegis-backend-xxxx.onrender.com
- **Health Check**: https://aegis-backend-xxxx.onrender.com/health
- **API**: https://aegis-backend-xxxx.onrender.com/state

---

## Important Notes

⚠️ **Free tier limitations**:
- Render free tier spins down after 15 minutes of inactivity (auto-restarts on next request)
- Vercel free tier is always active
- For always-on backend, upgrade to Render paid plan ($7+/month)

✅ **Keep deployments active**:
- Visit frontend URL periodically to keep it active
- This is fine for hackathon/demo purposes

---

## Next Steps

Once deployed:
1. Share the frontend URL with judges/stakeholders
2. The system is now live and demonstrates cloud-ready architecture ✅
3. This completes your rubric requirement for "Fully deployed (cloud/app/live)" → **5/5 marks**

