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
│   ├── config/         # Database and SMTP configurations
│   ├── controllers/    # Request handlers (auth, items, leases)
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # Mongoose Schemas (User, Item, Lease)
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point & cron job initialization
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components (Navbar, ItemCard)
    │   ├── pages/      # Home, Dashboard, Login, Register, CreateListing
    │   ├── App.js      # Routes and application entry
    │   └── index.js
