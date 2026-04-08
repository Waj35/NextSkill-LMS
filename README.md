# NextSkill — Learning Management System

A full-stack content-based learning platform built with React and Node.js. Features 10 courses across programming, finance, data science, and design with 5 different activity types.

## Features

- **Authentication** — JWT-based login/register with role-based access (student, instructor, admin)
- **Course Catalog** — Browse, search, and filter by category and difficulty
- **Enrollment System** — Enroll in courses and track progress
- **5 Activity Types** — Video, Reading (Markdown), Quiz, Assignment, Interactive Checklist
- **Quiz Engine** — Multiple choice with instant grading, scoring, and explanations
- **Progress Tracking** — Per-activity completion, course-level progress bars, dashboard stats
- **Personal Notes** — Add/delete notes on any activity
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Axios, React Markdown, React Icons |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Build Tool | Vite |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/database.js      # SQLite schema & connection
│   │   ├── middleware/auth.js       # JWT auth & role middleware
│   │   ├── routes/
│   │   │   ├── auth.js              # Register, login, profile
│   │   │   ├── courses.js           # CRUD, enroll, search/filter
│   │   │   ├── modules.js           # CRUD modules
│   │   │   ├── activities.js        # CRUD activities & quiz questions
│   │   │   └── progress.js          # Progress tracking, quiz submit, notes
│   │   ├── seeds/seed.js            # Sample data (10 courses, 72 activities)
│   │   └── server.js                # Express entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js             # API client with auth interceptors
│   │   ├── context/AuthContext.jsx   # Auth state management
│   │   ├── components/              # Navbar, ProtectedRoute, ProgressBar
│   │   └── pages/
│   │       ├── Auth/                # Login & Register
│   │       ├── Dashboard/           # Student dashboard with stats
│   │       ├── Course/              # Course listing & detail
│   │       └── Activity/            # Activity viewer (all 5 types)
│   └── package.json
└── package.json                     # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Waj35/NextSkill-LMS.git
cd NextSkill-LMS

# Install backend dependencies
cd backend
npm install

# Seed the database
npm run seed

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5001)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | alice@nextskill.com | password123 |
| Student | bob@nextskill.com | password123 |
| Instructor | sarah@nextskill.com | password123 |
| Instructor | mike@nextskill.com | password123 |
| Instructor | priya@nextskill.com | password123 |
| Admin | admin@nextskill.com | password123 |

## Courses

### Programming
- **JavaScript Fundamentals** — 4 modules, 15 activities
- **React for Beginners** — 3 modules, 9 activities
- **Data Science with Python** — 2 modules, 6 activities
- **Node.js Backend Development** — 2 modules, 6 activities

### Finance
- **Personal Finance Essentials** — 4 modules, 10 activities
- **Stock Market Investing 101** — 3 modules, 8 activities
- **Financial Modeling & Valuation** — 2 modules, 4 activities
- **Cryptocurrency & Blockchain** — 2 modules, 5 activities
- **Accounting for Non-Accountants** — 2 modules, 3 activities

### Design
- **UI/UX Design Principles** — 2 modules, 6 activities

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Courses
- `GET /api/courses` — List courses (query: search, category, difficulty)
- `GET /api/courses/:id` — Course detail with modules & activities
- `POST /api/courses/:id/enroll` — Enroll in course
- `GET /api/courses/user/enrolled` — My enrolled courses

### Activities
- `GET /api/activities/:id` — Activity detail with questions & notes

### Progress
- `POST /api/progress/:activityId` — Update progress
- `POST /api/progress/:activityId/submit-quiz` — Submit quiz answers
- `GET /api/progress/course/:courseId` — Course progress summary
- `POST /api/progress/:activityId/notes` — Add note
- `DELETE /api/progress/notes/:noteId` — Delete note

## License

MIT
