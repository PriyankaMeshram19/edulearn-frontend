# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 📚 EduLearn — Full-Stack E-Learning Platform (Frontend)

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Live Demo

- 🌐 Live App: [edulearn-frontend-5hoo.vercel.app](https://edulearn-frontend-5hoo.vercel.app)
- ⚙️ Backend Repo: [github.com/PriyankaMeshram19/edulearn-backend](https://github.com/PriyankaMeshram19/edulearn-backend)
- 🎥 Demo Video: [Watch on YouTube](PASTE_YOUR_YOUTUBE_LINK_HERE)

---

## 📌 About Project

**EduLearn** is a full-stack e-learning platform, inspired by platforms like Udemy, built end-to-end as a portfolio project. Students can browse courses, purchase them through a simulated multi-method payment gateway, watch course videos, and track their learning progress — all in a fully responsive, production-style interface. Admins get a dedicated dashboard to manage the entire course catalog and view enrollment analytics.

---

## ✨ Features

### Student Features
- 🔐 JWT-based Authentication (Register / Login / Forgot Password)
- 🏠 Dynamic Landing Page — courses loaded live from the database
- 🔍 Live search — filters courses as you type
- 💳 Simulated Payment Gateway — Card, UPI, Net Banking, QR Code, each with real-style validation
- 🎥 Course Player — embedded YouTube video + notes
- ✅ Scroll-gated course completion tracking
- 📊 Student Dashboard — purchased courses, Completed/Pending status
- 👤 Editable profile

### Admin Features
- 🛡️ Role-based dashboard, separate from the student experience
- 📚 Add / Edit / Delete courses from a clean modern UI
- 📊 Stats cards — total courses, students, enrollments
- 📈 Per-course enrollment breakdown — see exactly who's enrolled and their progress
- 👥 Student directory

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 (Vite) | UI framework |
| Tailwind CSS 4 | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Vercel | Deployment |

---

## 📁 Project Structure

## 📁 Project Structure

| Folder / File | Description |
|---|---|
| `src/components/` | Reusable components — CourseCard, PaymentModal, EnrolledStudentsModal, ProtectedRoute |
| `src/context/` | AuthContext — global authentication state |
| `src/pages/public/` | Landing Page |
| `src/pages/auth/` | Login, Register, Forgot Password, Reset Password |
| `src/pages/student/` | Student Dashboard, Course Player |
| `src/pages/admin/` | Admin Dashboard, Manage Courses, Manage Students |
| `src/pages/shared/` | Profile, 404 Not Found |
| `src/services/` | `api.js` — Axios instance for API calls |
| `screenshots/` | Project screenshots used in this README |
| `vite.config.js` | Vite build configuration |


## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js 18+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/PriyankaMeshram19/edulearn-frontend.git
cd edulearn-frontend

# 2. Install dependencies
npm install

# 3. Create a .env file in the root
echo VITE_API_BASE_URL=http://localhost:8080/api > .env

# 4. Run the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🚢 Deployment

Deployed on **Vercel**, connected directly to this GitHub repo — every push to `main` triggers an automatic redeploy. The live backend URL is injected via the `VITE_API_BASE_URL` environment variable.

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/01-landing-page.png)

### Login Page
![Login Page](screenshots/02-login-page.png)

### Student Dashboard
![Student Dashboard](screenshots/04-student-dashboard.png)

### Course Player
![Course Player](screenshots/05-course-player.png)

### Payment Simulation
![Payment Modal](screenshots/06-payment-modal.png)

### Admin Dashboard
![Admin Dashboard](screenshots/07-admin-dashboard.png)

### Manage Courses
![Manage Courses](screenshots/08-manage-courses.png)

---

## 👨‍💻 Developer

**Priyanka Meshram**
- 🔗 [GitHub](https://github.com/PriyankaMeshram19)
- 🔗 [LinkedIn](PASTE_YOUR_LINKEDIN_URL_HERE)

---

⭐ **If you found this project useful, consider giving it a star!** ⭐
