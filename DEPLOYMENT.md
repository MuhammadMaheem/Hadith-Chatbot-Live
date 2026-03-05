# 🚀 Deployment Guide: Render + Vercel (Separate Directories)

This guide walks you through deploying the Hadith Chatbot with the **backend on Render** and **frontend on Vercel** (completely FREE).

The repository is organized into two separate directories:

```
production-hadith-chatbot/
├── backend/                  ← Deploy to Render
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── data/
│   ├── models/
│   └── [other backend files]
│
├── frontend/                 ← Deploy to Vercel
│   ├── index.html
│   ├── static/
│   ├── templates/
│   ├── vercel.json
│   └── [frontend assets]
│
└── README.md
```

## 📋 Summary

| Component | Platform | Directory | URL | Cost |
|-----------|----------|-----------|-----|------|
| **Backend (Flask API)** | Render | `/backend` | `https://hadith-api.onrender.com` | 🎉 Free |
| **Frontend (HTML/CSS/JS)** | Vercel | `/frontend` | `https://hadith.vercel.app` | 🎉 Free |

---

## ✨ What's Been Set Up

Your frontend now has a **backend health check** that:
- ✅ Automatically detects when the backend is starting
- ✅ Shows a friendly loading message while the server boots
- ✅ Disables search until backend is ready
- ✅ Works around Render's free tier 30-60 second startup time

---

## 🔧 Deployment Steps

### **Step 1: Push to GitHub**

The repository has been reorganized into `backend/` and `frontend/` directories.

```bash
cd /home/arthas/Documents/GitHub/production-hadith-chatbot

# Stage all changes
git add -A

# Commit
git commit -m "Reorganize repo: separate backend and frontend directories

- Moved app.py, config.py, requirements.txt to backend/
- Moved templates/, static/, index.html to frontend/
- Configure Render to deploy from /backend
- Configure Vercel to deploy from /frontend
- Added health check with loading indicator"

# Push to GitHub
git push origin main
```

---

### **Step 2: Deploy Backend to Render**

#### **2a. Create Web Service**

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `production-hadith-chatbot`
4. Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `hadith-api` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --timeout 120` |
| **Instance Type** | `Free` ✅ |

#### **2b. Set Root Directory**

Click **Settings** → **Root Directory**

Set to: `backend`

This tells Render to deploy only the `/backend` folder!

#### **2c. Add Environment Variables**

In the **Environment** section, add:

```
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=production
```

**To get your GROQ_API_KEY:**
1. Go to [console.groq.com](https://console.groq.com)
2. Create an account
3. Generate API key from dashboard
4. Copy and paste into Render

#### **2d. Deploy**

Click **"Create Web Service"** → Wait 5 minutes

**Your backend URL:** `https://hadith-api-xxxx.onrender.com`

⚠️ **Save this URL** - you'll need it for the frontend!

---

### **Step 3: Deploy Frontend to Vercel**

#### **3a. Update Backend URL**

Edit `frontend/static/js/script.js` and update line 9-11:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://hadith-api-xxxx.onrender.com'; // ← REPLACE WITH YOUR RENDER URL
```

Then commit:
```bash
git add frontend/static/js/script.js
git commit -m "Update API URL to Render backend"
git push origin main
```

#### **3b. Create Vercel Deployment**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. In **Framework Preset**: Select `Other`
5. In **Root Directory**: Set to `frontend`

This tells Vercel to deploy only the `/frontend` folder!

#### **3c. Deploy**

Click **"Deploy"** → Wait 1-2 minutes

Your frontend will be at: `https://hadith.vercel.app` (or your custom domain)

---

## 🧪 Testing

### **Test Backend Health Check**

```bash
curl https://hadith-api-xxxx.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "hadiths_loaded": 39038,
  "models_loaded": true
}
```

### **Test Frontend**

1. Go to `https://hadith.vercel.app`
2. You should see **"Backend is starting up..."** message initially (first load only)
3. After 30-60 seconds, message disappears
4. Try searching for a hadith

---

## 📊 How the Health Check Works

```
Frontend loads
    ↓
Checks /health endpoint every 3 seconds
    ↓
Backend not ready? → Show loading message
    ↓
Backend ready? → Hide message, enable search ✅
```

---

## ⚡ Performance Tips

### **Free Tier Behavior:**
- **First request:** 30-50 seconds (Render spins up)
- **Subsequent requests:** ~2-5 seconds (fast)
- **Auto-sleep:** After 15 minutes of inactivity

### **User Experience:**
- Frontend loads instantly (Vercel CDN)
- Health check prevents confusion
- Clear messaging about startup time

---

## 🔄 Updates & Redeployment

Whenever you make changes, just push to GitHub!

```bash
# Backend code changes
git add backend/
git commit -m "Backend updates"
git push origin main
# Render auto-deploys!

# Frontend code changes
git add frontend/
git commit -m "Frontend updates"
git push origin main
# Vercel auto-deploys!
```

---

## 🚨 Troubleshooting

### **Render says "No Procfile found"**
✅ Make sure `backend/Procfile` exists (it should)

### **Vercel not deploying**
✅ Check that **Root Directory** is set to `frontend`

### **Frontend can't reach backend**
Check the URL in `frontend/static/js/script.js`:
```javascript
const API_BASE_URL = 'https://hadith-api-xxxx.onrender.com';
```

### **Health check stuck on loading**
- Check backend logs on Render
- Verify `GROQ_API_KEY` is set
- Try restarting the service

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render | 750 hours/month | **$0** ✅ |
| Vercel | Unlimited | **$0** ✅ |
| **Total** | | **$0** 🎉 |

---

## ✅ Checklist

- [ ] Reorganized repo into backend/ and frontend/
- [ ] Pushed to GitHub
- [ ] Created Render Web Service for backend
- [ ] Set Root Directory to `backend` on Render
- [ ] Added GROQ_API_KEY to Render
- [ ] Got Render backend URL
- [ ] Updated API URL in frontend/static/js/script.js
- [ ] Created Vercel deployment for frontend
- [ ] Set Root Directory to `frontend` on Vercel
- [ ] Tested health check
- [ ] Tested search query

---

## 🎉 You're Done!

Your chatbot is now **live and free**! 🚀

- **Frontend:** `https://hadith.vercel.app`
- **Backend:** `https://hadith-api-xxxx.onrender.com`

Share your link! ✨
