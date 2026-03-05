# 🚀 Deployment Guide: Render + Vercel

This guide walks you through deploying the Hadith Chatbot with the **backend on Render** and **frontend on Vercel** (completely FREE).

## 📋 Summary

| Component | Platform | URL | Cost |
|-----------|----------|-----|------|
| **Backend (Flask API)** | Render | `https://hadith-api.onrender.com` | 🎉 Free |
| **Frontend (HTML/CSS/JS)** | Vercel | `https://hadith.vercel.app` | 🎉 Free |

---

## ✨ New Features Added

Your frontend now has a **backend health check** that:
- ✅ Automatically detects when the backend is starting
- ✅ Shows a friendly loading message while the server boots
- ✅ Disables search until backend is ready
- ✅ Works around Render's free tier 30-60 second startup time

---

## 🔧 Setup Instructions

### **Step 1: Prepare Your Repository**

The following files have been created/updated:
- ✅ `Procfile` - Render configuration
- ✅ `requirements.txt` - Added `flask-cors`
- ✅ `app.py` - Added CORS headers
- ✅ `static/js/script.js` - Added health check logic
- ✅ `static/css/style.css` - Added loading message styles
- ✅ `vercel.json` - Vercel configuration

**Commit and push to GitHub:**

```bash
cd /home/arthas/Documents/GitHub/production-hadith-chatbot
git add -A
git commit -m "Setup for Render + Vercel deployment with health check"
git push origin main
```

---

### **Step 2: Deploy Backend to Render**

#### **2a. Sign up on Render**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account (recommended)
3. Connect your repository

#### **2b. Create Web Service**
1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repo: `production-hadith-chatbot`
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `hadith-api` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --timeout 120 --workers 1` |
| **Instance Type** | `Free` ✅ |

#### **2c. Add Environment Variables**

Click **Environment** tab and add:

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

Click **"Create Web Service"** and wait ~5 minutes.

**Your backend URL will be:** `https://hadith-api-xxxx.onrender.com`

⚠️ **Save this URL** - you'll need it for the frontend!

---

### **Step 3: Deploy Frontend to Vercel**

#### **3a. Update Backend URL in Frontend**

Before deploying, update your frontend with the Render backend URL:

Edit [static/js/script.js](static/js/script.js#L9-L11):

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://hadith-api-xxxx.onrender.com'; // ← REPLACE WITH YOUR RENDER URL
```

**Commit the change:**
```bash
git add static/js/script.js
git commit -m "Update API URL to Render backend"
git push origin main
```

#### **3b. Sign up on Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repo

#### **3c. Deploy**

**Option A: Auto-deploy (Recommended)**
- Vercel will auto-deploy every time you push to GitHub ✅

**Option B: Manual deploy**
```bash
npm install -g vercel
vercel --prod
```

Your frontend will be at: `https://hadith.vercel.app` (or custom domain)

---

## 🧪 Testing

### **Test Backend**
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
2. You should see **"Backend is starting up..."** message initially
3. After 30-60 seconds, message disappears
4. Try searching for a hadith

---

## 📊 How the Health Check Works

```
Frontend loads → Checks /health endpoint every 3 seconds
                    ↓
    Backend not ready? → Show loading message, disable search
                    ↓
    Backend ready? → Hide message, enable search ✅
```

The message shows:
- 🚀 **"Backend is starting up..."**
- **"This may take 30-60 seconds on free tier. Please wait."**

Then automatically disappears when ready!

---

## ⚡ Performance Tips

### **Free Tier Limitations:**
- **First request:** 30-50 seconds (Render spins up)
- **Subsequent requests:** ~2-5 seconds (fast)
- **Auto-sleep:** After 15 minutes of inactivity, backend spins down

### **User Experience:**
- Frontend is instant (Vercel CDN)
- Health check prevents confusion
- Clear messaging about loading time

---

## 🔄 Updates & Redeployment

Whenever you make changes:

```bash
# Backend code changes
git add app.py config.py
git commit -m "Backend updates"
git push origin main
# Render auto-deploys!

# Frontend code changes
git add static/
git commit -m "Frontend updates"
git push origin main
# Vercel auto-deploys!
```

---

## 🚨 Troubleshooting

### **Backend not starting**
```
Error: Module not found
```
**Fix:** Make sure all dependencies are in `requirements.txt`
```bash
pip freeze > requirements.txt
git push
```

### **Frontend can't reach backend**
Check the URL in `script.js`:
```javascript
// Should be your actual Render URL
const API_BASE_URL = 'https://hadith-api-xxxx.onrender.com';
```

### **CORS errors in console**
The app includes CORS headers, but verify in browser console:
```javascript
console.log('API URL:', API_BASE_URL);
```

### **Health check stuck on loading**
- Check backend logs on Render dashboard
- Verify `GROQ_API_KEY` is set
- Try restarting the service

---

## 📱 Custom Domain (Optional)

Both platforms support custom domains:

**Render:**
1. Go to **Settings** → **Custom Domain**
2. Point your domain DNS

**Vercel:**
1. Go to **Settings** → **Domains**
2. Add your domain

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render | Up to 750 hours/month | **$0** ✅ |
| Vercel | Unlimited | **$0** ✅ |
| **Total** | | **$0** 🎉 |

No credit card charged!

---

## ✅ Checklist

- [ ] All files pushed to GitHub
- [ ] Backend deployed on Render
- [ ] `GROQ_API_KEY` set on Render
- [ ] Got Render backend URL
- [ ] Updated `script.js` with backend URL
- [ ] Frontend deployed on Vercel
- [ ] Tested health check
- [ ] Tested search query

---

## 🎉 You're Done!

Your chatbot is now **live and free** on the internet! 🚀

- **Frontend:** `https://hadith.vercel.app`
- **Backend API:** `https://hadith-api-xxxx.onrender.com`

Share your link with others! ✨
