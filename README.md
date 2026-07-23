# Anpuneri NGO — Full Stack Management Platform

A production-ready, feature-rich MERN stack web application for an NGO organization, complete with a comprehensive admin panel for content and community management.

## 🌟 System Overview & Architecture

The system is built as a **Single Page Application (SPA)** using the **MERN** stack (MongoDB, Express, React, Node.js). 

### Frontend (Client-side)
* **Framework:** React 18 (powered by Vite)
* **State Management:** Redux Toolkit 
* **Routing:** React Router v6
* **Styling:** Tailwind CSS for a responsive, modern UI
* **Animations:** Framer Motion for smooth page transitions and micro-interactions
* **API Communication:** Axios with centralized services (`apiServices.js`)
* **Notifications:** React Hot Toast

### Backend (Server-side)
* **Framework:** Node.js with Express.js
* **Database:** MongoDB (using Mongoose as ODM)
* **Authentication:** JWT (JSON Web Tokens) with role-based access control (Admin, Editor)
* **File Storage & Processing:** Cloudinary with Multer for secure and optimized image storage

---

## 🚀 Key Modules & Features

### 🌍 Public Website
The public-facing site is designed to engage visitors, showcase the NGO's impact, and drive community support.
- **Hero slider** — Auto-rotating slides with animation controls.
- **Projects & Stories** — Showcase ongoing/completed projects and success stories with category filters, progress bars, and search.
- **Events & News** — Users can read news updates and see upcoming/past events with registration indicators.
- **Photo Gallery** — Masonry grid with lightbox and category filters.
- **Community Engagement:**
  - **Donation Page:** Preset + custom amounts, purpose selection.
  - **Volunteer Application:** Multi-step form with skills/interests toggle.
  - **Contact Page:** Form with category selection + contact details.
  - **Testimonials:** Public can submit reviews (go to draft status pending admin approval).
- **Static Pages** — Mission, Vision, Team, FAQs, Terms, Privacy, 404.

### 🛡️ Admin Panel (`/admin`)
A comprehensive dashboard to manage the entire platform dynamically.
- **Dashboard** — Overview of statistics (total donations, volunteers, active projects), KPI cards, donation charts (Recharts), and recent activity.
- **Content Management (CMS)** — Full CRUD (Create, Read, Update, Delete) with image upload and status management for:
  - Sliders & Banners
  - Projects & Events
  - News & Photo Gallery
  - Success Stories & Testimonials
  - FAQs & Team Members
- **Community Management** — Review and approve Volunteer applications, manage Contact messages, and track Donation records.
- **Site Settings** — Key-value settings editor to control website text, contact info, social links, and core images (Mission/Vision).
- **Storage Optimization** — Automated Cloudinary image deletion when records are updated or deleted to prevent storage bloat and save costs.

---

## 💻 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary Account (for image uploads)

### 1. Clone & Install

```bash
git clone <your-repo>
cd ngo-project

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

**Server** — create `.env` in the `server` directory:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo_db
JWT_SECRET=your-very-secret-jwt-key-change-this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@ngo.org
ADMIN_PASSWORD=Admin@123456
```

**Client** — create `.env` in the `client` directory:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
node utils/seeder.js
```
*This populates the database with default settings, an admin user (`admin@ngo.org` / `Admin@123456`), and sample content.*

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
│   ├── controllers/     # Route handlers (News, Projects, Settings, etc.)
│   ├── middlewares/     # Auth, error handler, rate limiter, Cloudinary upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # auth, public, admin API routes
│   └── utils/           # Helpers, email, seeder
│
└── client/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Public & Admin pages
        ├── layouts/     # PublicLayout, AdminLayout
        ├── redux/       # Global state management
        ├── services/    # Axios API services
        ├── hooks/       # Custom React hooks
        └── utils/       # Helper functions
```

---

## 🌐 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all published projects |
| GET | `/api/events` | List all published events |
| GET | `/api/news` | List all published news |
| GET | `/api/gallery` | List gallery images |
| POST | `/api/volunteer` | Submit volunteer application |
| POST | `/api/donate` | Process donation |

### Admin Endpoints (requires JWT)
All admin endpoints are under `/api/admin/` providing secure CRUD operations for all resources.

---

## 🚢 Deployment

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables including Cloudinary credentials.

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
- **Border radius**: 2xl (16px) for modern cards
- **Shadows**: Soft layered shadows

---

## 📝 License

MIT License — Free to use and modify.
