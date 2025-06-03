# 🚀 Deployment Guide – Dubai Luxury Cars  

Comprehensive instructions to deploy the full-stack application (React client + Node/Express API + MongoDB) on four popular PaaS platforms.

---

## 📂 Repository Layout Recap

```
.
├── client/          # React + TypeScript (CRA)
├── server/          # Node.js + Express + TS
├── docker-compose.yml
└── .github/workflows/ci.yml
```

Both apps can be deployed **containerised (Docker)** *or* via **native buildpacks**. Choose whichever each platform supports best.

---

## 1. Render.com (Recommended – free tier for demo)

### 1.1  MongoDB
1. Dashboard → **New → Database** → **MongoDB**.  
2. Name: `luxury-db`, Region: Frankfurt (or closest).  
3. Copy the **Internal connection string** → `MONGODB_URI`.

### 1.2  Backend (server)
| Setting | Value |
|---------|-------|
| **Service type** | Web Service |
| **Name** | luxury-api |
| **Environment** | Docker |
| **Branch** | main |
| **Docker build command** | *Render auto-detects Dockerfile* |
| **Start command** | `npm start` (contained in Dockerfile) |

**Environment Variables**

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://luxury-client.onrender.com
MONGODB_URI=<from db>
JWT_SECRET=<generate>
JWT_EXPIRE=30d
```

### 1.3  Frontend (client)
| Setting | Value |
|---------|-------|
| **Service type** | Static Site |
| **Build Command** | `npm run build` |
| **Publish Directory** | `client/build` |
| **Environment** | Node 18 |

**Env Vars**
```
REACT_APP_API_URL=https://luxury-api.onrender.com/api
```

### 1.4  Custom Domain  
Add domain → point CNAME/A records per Render’s DNS panel.

---

## 2. Railway.app (one-click full stack)

### 2.1  Quick Start

```bash
railway init
railway up          # CLI detects docker-compose
```

Accept prompts → Railway provisions:

* **Web** service from `server` Dockerfile  
* **Static** service from `client` build (copies out of Docker stage)  
* **MongoDB** plugin automatically if `MONGODB_URI` missing.

### 2.2  Manually Create Services

1. New Project → **Deploy from GitHub** select repo.  
2. Add **MongoDB** plugin.  
3. Configure `server` service → **Dockerfile** path `server/Dockerfile`.  
4. Configure `client` service → **Dockerfile** path `client/Dockerfile` *or* static buildpack:  
   * Build Cmd: `cd client && npm run build`  
   * Output: `client/build`  
5. `REACT_APP_API_URL` points to server’s Railway domain.

Railway auto-generates SSL & domains:  
`https://luxury-api.up.railway.app`, `https://luxury-client.up.railway.app`.

---

## 3. Vercel (Best for Frontend) + Railway/Render for API

### 3.1  Client on Vercel
1. `Import Project` → your repo, choose **`client/`** as root.  
2. Build Command: `npm run build` (default).  
3. Output Dir: `client/build` (set in *Settings → Build & Output*).  
4. Env var:
   ```
   REACT_APP_API_URL=https://luxury-api.up.railway.app/api
   ```
   (replace with Render/Railway URL)

Vercel auto-assigns domain `luxury-client.vercel.app` + preview URLs for every PR.

### 3.2  API on Railway / Render  
Deploy per section **1** or **2**. Ensure **CORS** in `server/src/index.ts` allows Vercel domain.

---

## 4. Heroku (classic buildpacks)

> Free dynos were removed; will sleep after 30 min on Eco plan.

### 4.1  Create Apps

```bash
heroku create luxury-api
heroku create luxury-client
```

### 4.2  Provision MongoDB (Atlas)

1. Create cluster on MongoDB Atlas.  
2. IP allow-list `0.0.0.0/0` *(or use VPC peering)*.  
3. Get SRV string → `MONGODB_URI`.

### 4.3  Deploy Server

```bash
cd server
heroku git:remote -a luxury-api
heroku stack:set heroku-22
heroku buildpacks:add heroku/nodejs
git subtree push --prefix server heroku main
```

Set config vars:

```bash
heroku config:set \
  NODE_ENV=production PORT=5000 \
  CLIENT_URL=https://luxury-client.herokuapp.com \
  MONGODB_URI=<atlas> JWT_SECRET=<secret>
```

### 4.4  Deploy Client

```bash
cd ../client
heroku git:remote -a luxury-client
heroku buildpacks:add heroku/nodejs
echo "web: serve -s build" > Procfile
npm i -g serve
git add Procfile
git commit -m "chore: add Procfile"
git subtree push --prefix client heroku main
```

Config:

```
heroku config:set REACT_APP_API_URL=https://luxury-api.herokuapp.com/api
```

### 4.5  SSL & Domain
Heroku auto-generates `*.herokuapp.com` SSL. For custom domain: `heroku domains:add yourdomain.com`.

---

## 5. Environment Variable Matrix

| Var | Client | Server |
|-----|--------|--------|
| `REACT_APP_API_URL` | ✅ | — |
| `CLIENT_URL` | — | ✅ |
| `MONGODB_URI` | — | ✅ |
| `JWT_SECRET` | — | ✅ |
| `PORT` | — | ✅ (defaults 5000 or `$PORT`) |

---

## 6. Verification Checklist

1. **Health endpoint**  
   ```
   GET https://your-api-domain/api/health
   → { status: 'ok' }
   ```
2. **CORS** errors? Update `CLIENT_URL` & CORS config.
3. **Env variable mismatch**: ensure both dashboards are populated.
4. **MongoDB network**: whitelist IP or enable VPC peering.
5. **HTTPS redirect** handled by Render/Vercel; optional in `.htaccess`.

---

## 7. Continuous Deployment

* GitHub → **Settings → Webhooks** (Heroku)  
* GitHub App integration for Render / Railway / Vercel.  
* PR → Preview build (Vercel) and CI (`.github/workflows/ci.yml`).  

---

## 8. Domain & SSL

All four platforms provide free SSL:
- Render & Railway: `*.onrender.com`, `*.railway.app`
- Vercel: `*.vercel.app`
- Heroku: `*.herokuapp.com`

Add **A** / **CNAME** records per provider docs for custom domain.

---

## 9. Scaling Notes

| Platform | Horizontal Scaling | Vertical Scaling | Notes |
|----------|-------------------|------------------|-------|
| Render   | Background workers, autoscaling | Up to 512 MB free -> 8 GB+ | High idle timeout for free |
| Railway  | Autoscale if usage > 0 | Slider (RAM/CPU) | Easy metrics |
| Vercel   | Edge network, auto | Build memory tiers | Only static/SSR |
| Heroku   | `heroku ps:scale web=2` | Performance dynos | Paid dynos for 24/7 |

---

## 10. Troubleshooting Quick-Ref

| Issue | Fix |
|-------|-----|
| **CORS** blocked | Add client domain to `cors()` origins in `server/src/index.ts` |
| 502 / 504 | Check server logs → platform dashboard |
| Build fails (client) | Set `CI=false` in build command or fix warnings |
| MongoDB auth error | Correct username/password, IP whitelist |
| Port binding (Heroku) | Use `process.env.PORT` in Express |

---

## 🎉 You’re Live!

Once DNS propagates you’ll access:

```
https://www.dubailuxurycars.com   # React client
https://api.dubailuxurycars.com   # Express API
```

Enjoy delivering a premium driving experience to your users! 🌟🚗
