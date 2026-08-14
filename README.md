# 🇮🇳 Tiranga Connect

### One Connection. One Nation. One India.

> A social referral and connection network built for the **15 August 2026 — 80th Independence Day Internship Day**.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Stack](https://img.shields.io/badge/stack-Next.js%20%2B%20Express%20%2B%20MongoDB-blue)

---

## 🌟 Overview

**Tiranga Connect** is a full-stack web application that visualizes social connections through a referral network:

1. **User A** shares a unique referral link with **User B**
2. **User B** registers using the link
3. **User B** becomes part of **User A's** network
4. **User B** receives their own referral link
5. The network continues growing — visualized as an interactive tree

> **Note:** This is a social connection/referral visualization project. It is NOT an investment, gambling, MLM, or money-making platform.

---

## ✨ Features

- 🔗 **Referral System** — Unique codes and shareable links
- 🌳 **Network Tree** — Interactive React Flow visualization
- 📊 **Analytics** — Growth charts, distribution, trends
- 🏆 **Leaderboard** — Unity Champions ranking
- 🎯 **Achievements** — Milestone badges (1, 5, 10, 25, 50, 100 connections)
- 🔔 **Notifications** — Real-time connection alerts
- 👤 **Profile Management** — Edit profile, change password
- 🛡️ **Admin Dashboard** — User management with search/filter
- 📱 **Mobile Responsive** — Bottom navigation for mobile
- 🌗 **Dark Mode** — Toggle between light and dark themes
- 🇮🇳 **Independence Day Theme** — Tricolor design system

---

## 🛠 Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Flow (@xyflow/react)
- Recharts
- Lucide React
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser
- CORS

---

## 📁 Folder Structure

```
tiranga-connect/
├── frontend/          # Next.js frontend
│   ├── app/           # Pages (App Router)
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # API, auth, utilities
│   └── types/         # TypeScript interfaces
├── backend/           # Express.js backend
│   └── src/
│       ├── config/    # Database config
│       ├── models/    # Mongoose models
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── services/  # Business logic
│       └── utils/     # Helpers
└── docs/              # Documentation
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone <repo-url>
cd tiranga-connect
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tiranga-connect
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
COOKIE_SECRET=your-cookie-secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongosh
```

**Option B: MongoDB Atlas**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Seed Demo Data
```bash
cd backend
npm run seed
```

This creates 10 demo users with referral relationships.

### 6. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open: **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | demo@tirangaconnect.app | Demo@123 |
| User | rahul@tirangaconnect.app | Demo@123 |

---

## 📋 API Endpoints

See [docs/API.md](docs/API.md) for full documentation.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/referrals/tree` | ✅ | Network tree |
| GET | `/api/referrals/stats` | ✅ | Stats |
| GET | `/api/referrals/my` | ✅ | Direct referrals |
| GET | `/api/leaderboard` | ❌ | Top users |
| GET | `/api/achievements` | ✅ | Achievements |
| GET | `/api/notifications` | ✅ | Notifications |
| GET | `/api/admin/stats` | 🔒 | Admin stats |
| GET | `/api/admin/users` | 🔒 | All users |

---

## 🧪 Testing the Core Flow

1. Open **http://localhost:3000** → Landing page
2. Click **Join the Network** → Register as SONU
3. Copy referral link (e.g., `/register?ref=SONU91`)
4. Open in **incognito window** → Register as RAHUL
5. Return to SONU's dashboard → See RAHUL in tree
6. Login as RAHUL → Copy RAHUL's link
7. Register AMAN with RAHUL's link
8. Check network tree — should show SONU → RAHUL → AMAN
9. Verify notifications, leaderboard, achievements update

---

## 🎨 Demo Referral Tree

```
SONU (SONU91)
├── RAHUL (RAHUL82)
│   ├── AMAN (AMAN33)
│   │   ├── ROHIT (ROHIT56)
│   │   └── KARAN (KARAN44)
│   └── NEHA (NEHA19)
├── PRIYA (PRIYA45)
│   ├── ARJUN (ARJUN78)
│   └── SAMEER (SAMEER22)
└── VIKASH (VIKASH67)
```

---

## 🚢 Deployment

### Backend (e.g., Railway, Render)
```bash
cd backend
npm run build
npm start
```

### Frontend (e.g., Vercel)
```bash
cd frontend
npm run build
npm start
```

Update environment variables:
- Frontend: `NEXT_PUBLIC_API_URL` → your deployed backend URL
- Backend: `CLIENT_URL` → your deployed frontend URL

---

## 📝 License

Built for **15 August 2026 Independence Day Internship Day** demonstration.

🇮🇳 Jai Hind!
