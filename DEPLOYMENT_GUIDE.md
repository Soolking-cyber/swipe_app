# 📦 Deployment Guide — Dubai Luxury Cars

> Deploy the full-stack luxury car-rental platform (React + Node/Express + MongoDB) to the cloud in minutes.

---

## 🌍 Table of Contents
1. Requirements  
2. Common Environment Variables  
3. ✨ Render (recommended all-in-one)  
4. ⚡ Railway (monorepo friendly)  
5. ▲ Vercel + Railway (frontend / backend split)  
6. 🚀 Heroku (classic PaaS)  
7. DNS & HTTPS  
8. Post-Deployment Checklist  

---

## 1  🔧 Requirements
| Tool | Version | Notes |
|------|---------|-------|
| Git | ≥ 2.30 | `git --version` |
| Docker | *optional* | Faster on Render/Railway |
| Node | ≥ 16 | local builds / tests |
| MongoDB Atlas | Free tier | or managed Mongo on provider |

---

## 2  📄 Common ENV Variables
Create the following keys on **all** platforms (names identical):

| Key | Example |
|-----|---------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://luxcars.app` |
| `MONGODB_URI` | Mongo Atlas URI |
| `JWT_SECRET` | long-random-string |
| `JWT_EXPIRE` | `30d` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Mail credentials |
| `FROM_NAME` | `Dubai Luxury Cars` |
| `FROM_EMAIL` | `noreply@luxcars.app` |
| `STRIPE_SECRET_KEY` | Stripe key (optional) |

The React client only needs:

```
REACT_APP_API_URL=https://api.luxcars.app/api
REACT_APP_SOCKET_URL=wss://api.luxcars.app
```

---

## 3  ✨ Deploy to **Render** (all-in-one easiest)

Render hosts web services, static sites & databases.

### 3.1  Create Services
1. **MongoDB** → *Add Database* → Free tier  
2. **Backend**  
   - *New Web Service* → “Deploy from GitHub”  
   - Select repo `swipe_app`, root **server/**  
   - Runtime: *Node* → Build Command: `npm run build`  
   - Start Command: `node dist/index.js`  
   - Autodeploy: ✅  
3. **Frontend**  
   - *New Static Site* → root **client/**  
   - Build Command: `npm run build`  
   - Publish Dir: `build`  
   - Add `REACT_APP_API_URL` in environment tab.

### 3.2  Set ENV
- Copy Mongo connection string from DB to `MONGODB_URI`.  
- Add all variables from section 2.  
- In *Static Site* also add `REACT_APP_API_URL` & optional analytics keys.

### 3.3  Configure Rewrite for React Router
Render Static → **Redirects/Rewrites**  
```
Source: /*  
Destination: /index.html  
Status: 200
```

### 3.4  Custom Domains & HTTPS
Add your domain in **Settings → Custom Domains** for each service. TLS is automatic.

---

## 4  ⚡ Deploy to **Railway**

Railway excels with monorepos & Docker.

### 4.1  One-click Template
```bash
railway init
railway up
```
When prompted choose **Docker** and Railway will detect `docker-compose.yml`.

*OR* create separate services:

| Service | Path | Build Cmd | Start Cmd |
|---------|------|-----------|-----------|
| Web (server) | `server/` | `npm run build` | `node dist/index.js` |
| Static (client) | `client/` | `npm run build` | `serve -s build` |

### 4.2  Database
- *Add Plugin → MongoDB* and copy URI.

### 4.3  Environment Variables
- Project-level variables → paste keys from section 2.

### 4.4  Deploy Triggers
Railway auto-deploys on push to `main`.  
Use `Settings → Variables → Sync from GitHub` to keep secrets up-to-date.

---

## 5  ▲ Vercel (Frontend) + Railway (Backend)

**Best for edge-optimised React site + server API in Railway.**

### 5.1  Backend on Railway
Follow §4 (single *Web service*).

### 5.2  Frontend on Vercel
1. Import GitHub repo.  
2. **Framework**: *Create React App* is auto-detected.  
3. **Build Command**: `npm run build`  
4. **Output Dir**: `build`  
5. **Environment Variables**:  
   - `REACT_APP_API_URL=https://<railway-subdomain>.railway.app/api`  
   - `REACT_APP_SOCKET_URL=wss://<railway-subdomain>.railway.app`  

### 5.3  Custom Domain
Add apex/root to Vercel (frontend) and `api.<domain>` CNAME to Railway.

---

## 6  🚀 Deploy to **Heroku** (classic PaaS)

### 6.1  Create Apps
```bash
heroku create luxcars-api
heroku create luxcars-client --buildpack heroku/static
```

### 6.2  Mongo Add-on
```bash
heroku addons:create mongodbatlas --app luxcars-api
```
Copy `MONGODB_URI` from add-on config.

### 6.3  Set ENV
```bash
heroku config:set NODE_ENV=production JWT_SECRET=... --app luxcars-api
heroku config:set REACT_APP_API_URL=https://luxcars-api.herokuapp.com/api --app luxcars-client
```

### 6.4  Deploy
```bash
# backend
git subtree push --prefix server heroku main
# frontend
git subtree push --prefix client luxcars-client main
```

### 6.5  Free Dyno note  
Heroku free tier sleeps; upgrade or use Render/Railway for always-on.

---

## 7  🌐 DNS & HTTPS

| Provider | Automatic TLS | Notes |
|----------|---------------|-------|
| Render   | Yes | One CNAME per service |
| Railway  | Yes | Use `railway.app` subdomain or custom |
| Vercel   | Yes | Proxy `www` & root to Vercel |
| Heroku   | Yes (paid dynos) | Free cert via ACM |

Add A/AAAA or CNAME records as instructed by each platform.

---

## 8  ✅ Post-Deployment Checklist
- [ ] Environment variables set & **no secrets committed**  
- [ ] MongoDB network access allows chosen platform IP range (Atlas)  
- [ ] `CLIENT_URL` matches deployed frontend URL  
- [ ] Emails send successfully (check SMTP logs)  
- [ ] Stripe webhooks (if enabled) point to `/api/payments/webhook`  
- [ ] Smoke test: sign-up → verify email → book a car → admin dashboard  
- [ ] Enable CI/CD status checks in GitHub branch protection  

Enjoy your **Dubai Luxury Cars** platform live in the cloud! 🏎️💨
