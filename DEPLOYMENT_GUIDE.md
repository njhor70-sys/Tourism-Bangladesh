# Tourism Bangladesh — Deployment Guide
## Step-by-step: MongoDB Atlas + Render + Netlify

---

## STEP 1 — MongoDB Atlas Setup (Database)

1. https://cloud.mongodb.com → Sign Up (free)
2. "Build a Database" → Free tier → Create
3. Username & Password তৈরি করো (মনে রাখো)
4. "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
5. "Connect" → "Drivers" → Connection String copy করো
   Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/

---

## STEP 2 — Gmail App Password (Email এর জন্য)

1. Gmail → Google Account → Security
2. "2-Step Verification" ON করো
3. "App Passwords" → App: "Mail", Device: "Other" → "Tourism Bangladesh"
4. 16-digit password generate হবে — এটা save করো

---

## STEP 3 — Backend .env file তৈরি করো

backend/ folder-এ .env নামে file তৈরি করো:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tourism-bangladesh
JWT_SECRET=tourism_secret_key_change_this_to_something_long
EMAIL_USER=tomar_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=https://tomar-site.netlify.app
PORT=5000
```

---

## STEP 4 — GitHub-এ Push করো

```bash
git add .
git commit -m "Updated project with all features"
git push origin main
```

**Important:** .env file কখনো push করবে না! .gitignore-এ আছে কিনা check করো।

---

## STEP 5 — Render Deploy (Backend)

1. https://render.com → Sign up with GitHub
2. "New" → "Web Service"
3. তোমার GitHub repo select করো
4. Settings:
   - Name: tourism-bangladesh-api
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: node server.js
5. "Environment Variables" → Add করো:
   - MONGO_URI = (তোমার MongoDB URL)
   - JWT_SECRET = (তোমার secret key)
   - EMAIL_USER = (Gmail)
   - EMAIL_PASS = (App Password)
   - FRONTEND_URL = (Netlify URL, পরে add করবে)
6. "Create Web Service" → Deploy হতে ৫-১০ মিনিট লাগবে
7. তোমার Render URL পাবে: https://tourism-bangladesh-api.onrender.com

---

## STEP 6 — config.js Update করো

config.js খুলে Render URL বসাও:

```javascript
const API = "https://tourism-bangladesh-api.onrender.com/api";
```

আবার GitHub-এ push করো।

---

## STEP 7 — Netlify Deploy (Frontend)

1. https://netlify.com → Sign up with GitHub
2. "Add new site" → "Import an existing project"
3. GitHub repo select করো
4. Settings:
   - Base directory: (blank রাখো — root folder)
   - Publish directory: . (dot দাও)
   - Build command: (blank রাখো)
5. Deploy!
6. তোমার Netlify URL পাবে: https://random-name.netlify.app

---

## STEP 8 — Final: CORS Fix

Render-এ যাও → Environment Variables → FRONTEND_URL add করো:
```
FRONTEND_URL = https://tomar-actual-site.netlify.app
```
Render auto-redeploy করবে।

---

## STEP 9 — Tour Data Seed করো

Backend deploy হওয়ার পর browser-এ যাও:
https://tourism-bangladesh-api.onrender.com/api/tours/seed

"8 tours added!" দেখলে সফল!

---

## সমস্যা হলে Check করো:

- ❌ "Cannot connect to server" → config.js-এ API URL ঠিক আছে?
- ❌ Login কাজ করছে না → .env-এ MONGO_URI ঠিক আছে?
- ❌ Email আসছে না → Gmail App Password সঠিক?
- ❌ CORS error → Render-এ FRONTEND_URL দিয়েছ?
