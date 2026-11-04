# MindPulse Backend API

A complete, production-ready REST API backend built for the **MindPulse** 3D Competitive Exam Practice Platform.

---

## 🚀 Features

- **Auth & Session Sync**: Email/Password authentication & Google OAuth sync (`/api/auth/sync`).
- **All 10 Exam Categories & Exams**: UPSC, SSC, Banking, Railway, Defence, Police, Teaching, Engineering/Medical, and more.
- **Bilingual MCQ Practice & Mock Tests**: Full support for Hindi and English question papers and explanations.
- **Automatic Score Evaluation**: Instant calculation of correct, wrong, negative marking, percentile, and accuracy.
- **Student Dashboard & Analytics**: Streak tracking, weak topic detector, and recent test attempts.
- **Offline / Standalone Fallback**: Can run standalone with mock fallback data even if MongoDB is not running locally.
- **Admin Control**: Bulk CSV/JSON question import and question reporting system.

---

## 📁 Project Structure

```
back-end/
├── .env
├── .env.example
├── package.json
└── src/
    ├── config/
    │   └── db.js               # MongoDB Mongoose connection
    ├── controllers/
    │   ├── authController.js   # Login, Register, Sync Google
    │   ├── examController.js   # Categories & Exams
    │   ├── questionController.js # MCQs & Daily Quiz
    │   ├── testController.js   # Mock Tests & Evaluation
    │   ├── userController.js   # Dashboard Stats & Leaderboard
    │   └── adminController.js  # Bulk Upload & Stats
    ├── middleware/
    │   ├── auth.js             # JWT verification & role checks
    │   └── error.js            # 404 & Global error handlers
    ├── models/
    │   ├── Exam.js
    │   ├── MockTest.js
    │   ├── Question.js
    │   ├── TestAttempt.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── examRoutes.js
    │   ├── questionRoutes.js
    │   ├── testRoutes.js
    │   └── userRoutes.js
    ├── seeds/
    │   └── seed.js             # Initial database seed script
    ├── utils/
    │   └── examData.js         # Master exams list matching frontend
    └── server.js               # Express application entry
```

---

## 🛠️ How to Run

1. Start the backend:
```bash
cd back-end
npm run dev
```

2. Seed database (Optional, when MongoDB is active):
```bash
npm run seed
```

