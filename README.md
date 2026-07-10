# Anpuneri NGO — Full Stack Management Platform

A production-ready MERN stack website for an NGO organization with a comprehensive admin panel.

## 🌟 Features

### Public Website
- **Hero slider** — 3 auto-rotating slides with animation controls
- **Projects** — Listings with category/status filters, progress bars, search
- **Events** — Upcoming/past events with registration indicators
- **News & Blog** — Articles with category filters and search
- **Photo Gallery** — Masonry grid with lightbox and category filters
- **Donation page** — Preset + custom amounts, purpose selection
- **Volunteer application** — Multi-step form with skills/interests toggle
- **Team page** — Staff grid with social links
- **Contact page** — Form with category selection + contact details
- **FAQs** — Accordion with category filtering
- **Static pages** — Mission, Vision, Privacy, Terms, 404

### Admin Panel (`/admin`)
- **Dashboard** — KPI cards, donation charts (Recharts), recent activity
- **Projects** — Full CRUD with image upload, category/status management
- **Donations** — Transaction table with status updates
- **Volunteers** — Application management with approve/reject
- **Messages** — Contact inbox with status tracking
- **Settings** — Key-value settings editor with groups

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Redux Toolkit, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Email | Nodemailer |
| Logging | Winston |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone <your-repo>
cd ngo-project

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment

**Server** — copy `.env.example` to `.env`:
```bash
cd server
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo_db
JWT_SECRET=your-very-secret-jwt-key-change-this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@ngo.org
ADMIN_PASSWORD=Admin@123456
```

**Client** — copy `.env.example` to `.env`:
```bash
cd client
cp .env.example .env
```

### 3. Seed the Database

```bash
cd server
node utils/seeder.js
```

This creates:
- 1 admin user (email: `admin@ngo.org`, password: `Admin@123456`)
- 5 projects, 4 events, 4 news articles
- 6 team members, 4 testimonials, 8 FAQs
- 3 success stories, 8 gallery images
- Sample donations and volunteers
- 13 settings

### 4. Start Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Visit:
- **Public site**: `http://localhost:5173`
- **Admin panel**: `http://localhost:5173/admin`

---

## 📁 Project Structure

```
ngo-project/
├── server/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Auth, error handler, rate limiter, upload
│   ├── models/          # Mongoose schemas (12 models)
│   ├── routes/          # auth, public, admin
│   ├── uploads/         # Uploaded files
│   └── utils/           # Logger, seeder, email, helpers
│
└── client/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Public + Admin pages
        ├── layouts/     # PublicLayout, AdminLayout
        ├── redux/       # Store + slices
        ├── services/    # API services
        ├── hooks/       # Custom React hooks
        ├── utils/       # Helper functions
        └── constants/   # App constants
```

---

## 🌐 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all published projects |
| GET | `/api/events` | List all published events |
| GET | `/api/news` | List all published news |
| GET | `/api/gallery` | List gallery images |
| GET | `/api/team` | List team members |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/faqs` | List FAQs |
| POST | `/api/volunteer` | Submit volunteer application |
| POST | `/api/donate` | Process donation |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/stats` | Get public organization stats |

### Admin (requires JWT)
All admin endpoints under `/api/admin/` with CRUD operations for all resources.

---

## 🚢 Deployment

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables

### Frontend (Vercel)
1. Import GitHub repo to Vercel
2. Set `VITE_API_URL` to your Render backend URL
3. Deploy

---

## 🎨 Design System

- **Primary**: Blue `#1565C0`
- **Secondary**: Green `#2E7D32`
- **Accent**: Orange `#E65100`
- **Fonts**: Plus Jakarta Sans (headings) + Inter (body)
- **Border radius**: 2xl (16px) for cards
- **Shadows**: Soft layered shadows

---

## 📝 License

MIT License — Free to use and modify.
