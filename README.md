# 🏍️ DelhiBikesHub

> Delhi's #1 marketplace for buying and selling pre-owned bikes & scooties.

A full-stack web application built with **React + Vite** (frontend) and **Express + Supabase** (backend), featuring Cloudinary image uploads, role-based admin panel, and full mobile responsiveness.

---

## 📁 Project Structure

```
DelhiBikesHub/
├── client/                 ← React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # Auth & Bike context providers
│   │   └── lib/            # API client & Supabase config
│   ├── public/             # Static assets
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                 ← Express API Backend
│   ├── config/             # Supabase & Cloudinary config
│   ├── middleware/          # Auth & upload middleware
│   ├── routes/             # API route handlers
│   ├── index.js            # Server entry point
│   └── package.json
│
├── supabase/               ← Database schema
│   └── schema.sql
│
├── package.json            ← Root workspace scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- [Supabase](https://supabase.com) account
- [Cloudinary](https://cloudinary.com) account

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/DelhiBikesHub.git
cd DelhiBikesHub

# Install root workspace dependencies
npm install

# Install client & server dependencies
npm run install:all
```

### 2. Set Up Environment Variables

**Frontend** — `client/.env`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

**Backend** — `server/.env`
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

CLIENT_URL=http://localhost:5173
```

### 3. Set Up Database

Run `supabase/schema.sql` in your Supabase SQL Editor to create tables, indexes, and RLS policies.

### 4. Run Development

```bash
# Start both client and server simultaneously
npm run dev

# Or run them separately:
npm run dev:client    # Frontend at http://localhost:5173
npm run dev:server    # Backend at http://localhost:5000
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express server only |
| `npm run build` | Build frontend for production |
| `npm run start` | Start production server |
| `npm run install:all` | Install all dependencies |
| `npm run lint` | Run ESLint on frontend |

---

## 🛡️ Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configurable origin whitelist
- **Rate Limiting** — General (100/15min) & auth-specific (20/15min)
- **JWT Auth** — Supabase token verification
- **RLS** — Row Level Security on all database tables
- **Input Validation** — Server-side validation on all mutations
- **Multer** — File type & size validation (5MB, JPEG/PNG/WebP only)

---

## 📱 Responsive Design

Fully responsive across all breakpoints:

| Breakpoint | Width | Target |
|------------|-------|--------|
| xs | 320px | Small phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

Additional mobile features:
- Touch swipe on image galleries
- Safe area insets for notched devices
- `prefers-reduced-motion` support
- Minimum 44×44px tap targets
- iOS input zoom prevention

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Animations | Framer Motion |
| Backend | Express.js 4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Images | Cloudinary + Multer |
| Icons | Lucide React |

---

## 🚢 Deployment

### Frontend → Vercel
1. Connect your GitHub repo
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables

### Backend → Render / Railway
1. Set root directory to `server`
2. Start command: `node index.js`
3. Add environment variables
4. Set `CLIENT_URL` to your Vercel domain

---

## 👨‍💻 Author

**Md Tanveer Alam**  
[Portfolio](https://mdtanveeralamdev.vercel.app/) • [GitHub](https://github.com/mdtanveer0786)

---

## 📄 License

This project is private and proprietary.
