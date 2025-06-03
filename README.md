# Dubai Luxury Cars – Full-Stack Web Application

Premium car-rental platform built to deliver a Tinder-like swiping experience for choosing luxury cars in Dubai, complete with a powerful admin dashboard, real-time notifications and a modern micro-service-ready backend.

---

## ✨  Highlights
* Swipe UI (React + react-spring) for quick discovery  
* Advanced filters (price range, brand, year, features, …)  
* Secure authentication & JWT-based sessions  
* Admin portal to manage cars, bookings, users & analytics  
* Socket.io real-time notifications (booking status, admin alerts)  
* Modular Node.js/Express API with MongoDB models  
* Stripe-ready payment service stub  
* Fully typed codebase (TypeScript on both client & server)  
* Ready for containerised or serverless deployment

---

## 🗂️  Monorepo Structure

```
.
├── client/          # React app (Vite / CRA)
│   ├── src/
│   └── package.json
├── server/          # Node.js API (Express)
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔧  Prerequisites

| Tool | Version (tested) |
|------|------------------|
| Node | ≥ 16 |
| npm  | ≥ 9 / **or** Yarn ≥ 1.22 |
| MongoDB | ≥ 5 (local or Atlas) |
| Docker *(optional)* | ≥ 20 |

---

## 🚀  Local Development

### 1. Clone & install

```bash
git clone https://github.com/your-org/dubai-luxury-cars.git
cd dubai-luxury-cars

# install root‐level dev tools (optional)
# npm i -g pnpm

# client
cd client && npm i
# server
cd ../server && npm i
```

### 2. Environment variables

Create `.env` files in **server/** and **client/** (examples below).

#### server/.env

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/luxury-car-rental
JWT_SECRET=superSecret123
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<ethereal_user>
SMTP_PASSWORD=<ethereal_pass>
FROM_NAME=Dubai Luxury Cars
FROM_EMAIL=noreply@dubailuxurycars.com
STRIPE_SECRET_KEY=sk_test_xxx          # optional
```

#### client/.env

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run both apps

```
# terminal 1
cd server
npm run dev       # nodemon + ts-node

# terminal 2
cd client
npm start         # CRA dev server
```

Browse to **http://localhost:3000**.

---

## 🏗️  Production Build

### Single-VM / VPS

```bash
# Build React
cd client && npm run build
# Build TS → JS
cd ../server && npm run build
# Start
NODE_ENV=production npm start
```

Static files are served from `client/build` by Express in production mode.

### Docker (recommended)

```bash
docker-compose up --build
```

`docker-compose.yml` spins up `server`, `client` (Nginx), and `mongo` containers.

---

## ☁️  Deployment Guidelines

| Platform | Notes |
|----------|-------|
| **Render** | Combine Dockerfile or two separate services (web + background); add environment variables in dashboard. |
| **Heroku** | Use two apps or a mono-buildpack: heroku/nodejs for `server`, heroku-static for React build. Attach MongoDB Atlas. |
| **Vercel + Railway** | Deploy client to Vercel (static build), server API to Railway (Docker). Add `CORS` origins accordingly. |

*Remember to set `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET` and mail/Stripe keys on the hosting dashboard.*

---

## 🧪  Testing

```
# unit & integration tests (Jest)
cd server
npm test
```

Add Cypress for e2e (not included by default).

---

## 🛠️  Linting & Formatting

```
npm run lint        # ESLint
npm run format      # Prettier
```

CI pipelines should fail on lint errors.

---

## 🗄️  Seed & Reset Database

```bash
cd server
npm run seed        # seeds demo cars & admin user
```

Modify `src/utils/seeder.ts` to adapt demo data.

---

## 👥  Access Credentials (demo)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@luxcars.ae | Admin123! |
| User  | user@luxcars.ae  | User123!  |

*(Created by seed script. **Change in production!**)*

---

## 📑  API Reference

Full Swagger collection coming soon. Quick peek:

```
GET    /api/cars
GET    /api/cars/:id
POST   /api/auth/login
POST   /api/bookings      # auth required
...
```

---

## 🙏  Contributing

1. Fork & branch (`feat/my-feature`)  
2. Run `npm run lint && npm test`  
3. Open PR against `main`

---

## © License

MIT — Free to use for commercial & personal projects. Attribution appreciated!
