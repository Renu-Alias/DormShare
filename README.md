# DormShare
> A hyper-local, peer-to-peer micro-leasing marketplace, designed exclusively for college campuses.
Campus micro-leasing platform — students borrow, rent, and lend campus essentials.

## Features

- **Borrow** — request items from peers for a set period; lenders approve or reject requests
- **Rent** — lease items at a fixed price with a return date
- **Lend** — list your own items for others to borrow or rent
- **Marketplace** — browse, search, and filter available items by category and hostel block
- **Dashboard** — manage your listings, track borrowed items, and handle incoming requests
- **Authentication** — register with a college email, log in, edit profile, reset password

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, React Router 7, Tailwind CSS v4, Vite 8 |
| Backend     | Express 5, Mongoose, JWT, bcryptjs              |
| Database    | MongoDB (Atlas or local)                        |
| Auth        | HTTP‑Only cookies, bcrypt password hashing      |

## Project Structure

```
DormShare/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection with retry logic
│   │   └── smtp.js            # SMTP configuration
│   ├── controllers/
│   │   ├── authController.js   # Register, login, logout, profile, password reset
│   │   ├── itemController.js   # CRUD for marketplace items
│   │   └── leaseController.js  # Borrow requests, approve, reject, return
│   ├── middleware/
│   │   ├── auth.js             # JWT cookie verification
│   │   └── validation.js       # Request validation rules
│   ├── models/
│   │   ├── user.js             # User schema (name, email, block, room, etc.)
│   │   ├── item.js             # Item schema (title, category, images, etc.)
│   │   └── borrowrecord.js     # Borrow record schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── itemRouts.js        # /api/items/*
│   │   └── leaseRoutes.js      # /api/leases/*
│   ├── utils/
│   │   └── email.js            # Email helpers
│   ├── server.js               # App entry point
│   ├── .env.example            # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BorrowModal.jsx     # Modal for submitting a borrow request
│   │   │   ├── CategoryCard.jsx    # Category grid icon card
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx            # Landing page hero section
│   │   │   ├── ItemCard.jsx        # Marketplace item card
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state + cookie-based session
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Marketplace.jsx     # Item browsing with filters
│   │   │   ├── Dashboard.jsx       # User dashboard with requests
│   │   │   ├── CreateListing.jsx   # Post a new item
│   │   │   └── EditProfile.jsx
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance (withCredentials)
│   │   │   ├── itemService.js      # Item API calls + mock fallback
│   │   │   └── leaseService.js     # Borrow/lease API calls + mock fallback
│   │   ├── App.jsx                 # Route definitions
│   │   ├── index.css               # Tailwind theme + global styles
│   │   └── main.jsx                # Entry point
│   ├── vite.config.js
│   └── package.json
│
├── logo.png
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local instance)
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET, and other variables
npm install
node server.js
```

The server starts on `http://localhost:5000`.

#### Environment Variables (`.env`)

| Variable             | Description                            |
|----------------------|----------------------------------------|
| `MONGO_URI`          | MongoDB connection string (SRV)        |
| `MONGO_URI_NON_SRV`  | Fallback non-SRV connection string     |
| `MONGO_URI_FALLBACK` | Local MongoDB fallback                 |
| `JWT_SECRET`         | Secret for signing JWTs                |
| `CORS_ORIGIN`        | Frontend URL (default `http://localhost:5173`) |
| `ALLOWED_EMAIL_DOMAINS` | Comma-separated email domains for registration |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`. API calls to `/api/*` and `/uploads/*` are proxied to `http://localhost:5000`.

To create a production build:

```bash
npm run build
```

### Running Both

Start the backend first, then the frontend. When both are running, the frontend communicates with the real backend and MongoDB. If the backend is unreachable, the frontend falls back to mock data for offline development.

## API Overview

| Method | Endpoint                      | Auth     | Description               |
|--------|-------------------------------|----------|---------------------------|
| POST   | `/api/auth/register`          | No       | Register a new user       |
| POST   | `/api/auth/login`             | No       | Log in                    |
| POST   | `/api/auth/logout`            | Yes      | Clear auth cookie         |
| GET    | `/api/auth/me`                | Yes      | Get current user profile  |
| PUT    | `/api/auth/updateprofile`     | Yes      | Update name, block, room  |
| PUT    | `/api/auth/updatepassword`    | Yes      | Change password           |
| POST   | `/api/auth/forgotpassword`    | No       | Request password reset    |
| PUT    | `/api/auth/resetpassword/:token` | No    | Reset password with token |
| GET    | `/api/items`                  | No       | List available items      |
| GET    | `/api/items/myitems`          | Yes      | List current user's items |
| GET    | `/api/items/:id`              | No       | Get item by ID            |
| POST   | `/api/items`                  | Yes      | Create a new item         |
| PUT    | `/api/items/:id`              | Yes      | Update an item            |
| DELETE | `/api/items/:id`              | Yes      | Delete an item            |
| PATCH  | `/api/items/:id/availability` | Yes      | Toggle item availability  |
| POST   | `/api/leases/borrow`          | Yes      | Submit a borrow request   |
| PUT    | `/api/leases/:id/approve`     | Yes      | Approve a borrow request  |
| PUT    | `/api/leases/:id/reject`      | Yes      | Reject a borrow request   |
| PUT    | `/api/leases/:id/return`      | Yes      | Mark item as returned     |
