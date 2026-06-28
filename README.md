# DormShare 📦🎓

DormShare is a hyper-local, peer-to-peer micro-leasing marketplace built on the MERN stack, designed exclusively for college campuses. 

At the end of every semester, students throw away or give away perfectly good essentials (textbooks, kettles, table lamps, mattresses) simply because they can't logistically haul them back home. DormShare solves this waste cycle by enabling students to seamlessly list, borrow, lease, or rent campus essentials within a trusted, closed student community.

---

## ✨ The USP (Unique Selling Proposition)
* **Campus-Domain Verification:** Eliminates external spam and trust issues by strictly validating registration via official college email domains (e.g., `@mits.ac.in`).
* **Automated Return Reminders:** Features an integrated backend scheduling engine (`node-cron`) that monitors lease durations and dispatches automated email alerts via `Nodemailer` to borrowers when the semester ends and items are due.

---

## 🚀 Key Features
* **Hyper-Local Campus Listings:** Complete CRUD functionality for adding items with status flags, description, and specific item conditions.
* **Dual-Role User Dashboard:** A clean user profile splitting active items into transparent "Items Lent" and "Items Borrowed" categories for easy accountability.
* **Localized Filtering:** Quick-search system filtering marketplace items by specific campus buildings or hostel blocks.
* **Secure Session Handling:** Protected routes via JSON Web Tokens (JWT) ensuring user actions are securely tied to verified profiles.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Utilities:** `node-cron` (Task Scheduling), `Nodemailer` (Email Service), `jsonwebtoken` (Authentication)

---

## 📁 Project Structure

```text
DormShare/
├── backend/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── smtp.js         # Nodemailer transporter
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile, password reset
│   │   ├── itemController.js    # Listing CRUD, search, filter, toggle
│   │   └── leaseController.js   # Borrow, return, extension, countdown, overdue
│   ├── middleware/
│   │   ├── auth.js              # JWT protect middleware
│   │   └── validation.js        # Input sanitizers for auth, items, leases
│   ├── models/
│   │   ├── user.js              # User schema (college email, hostel, etc.)
│   │   ├── item.js              # Item listing schema
│   │   └── borrowrecord.js      # Lease/borrow record schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── itemRouts.js         # /api/items/*
│   │   └── leaseRoutes.js       # /api/leases/*
│   ├── uploads/                 # Local image storage (gitignored)
│   ├── server.js                # Entry point, routes, cron, error handlers
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)
- Gmail account (for SMTP) or any email provider

### 1. Clone the repo
```bash
git clone https://github.com/<your-org>/DormShare.git
cd DormShare
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment variables
Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `ALLOWED_EMAIL_DOMAINS` | Comma-separated college domains (e.g. `@mits.ac.in`) |
| `FROM_EMAIL` | Sender email for transactional emails |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | SMTP username (usually same as `FROM_EMAIL`) |
| `SMTP_PASS` | SMTP password (for Gmail: use an **App Password**) |

> **Note:** `.env` is `.gitignore`’d — never commit real secrets.

### 4. Create uploads folder
The backend stores uploaded images in `backend/uploads/`. Create it manually if it doesn't exist:
```bash
mkdir backend/uploads
```

### 5. Run the backend
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### 6. Run the frontend
```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## 📝 Team Notes
- Share `.env` values via private channel only (GitHub Issues / Discord / WhatsApp), never commit them.
- For SMTP/Gmail: enable **2-Step Verification** and use an **App Password** as `SMTP_PASS`.
- For MongoDB: use a shared Atlas cluster M0 (free tier) and share the connection string privately.
