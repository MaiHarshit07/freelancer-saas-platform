A full-stack MERN SaaS platform that connects freelancers and clients in a modern scalable ecosystem.

## Features

- User Authentication (JWT)
- Role-Based Access (Client / Freelancer)
- Secure Password Hashing with bcrypt
- Login & Registration APIs
- MongoDB Atlas Integration
- REST API Architecture
- MVC Backend Structure
- Real-time Messaging (Upcoming)
- Project & Gig Management (Upcoming)
- Dashboard Analytics (Upcoming)

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

## Backend Architecture

```bash
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── authController.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── .env
├── package.json
└── server.js
```

---

## Authentication Flow

```text
Client Request
      ↓
Routes
      ↓
Controllers
      ↓
JWT Authentication
      ↓
MongoDB Database
```

---

## Current Progress

- [x] Express Server Setup
- [x] MongoDB Connection
- [x] User Schema
- [x] Register API
- [x] Login API
- [x] Password Hashing
- [x] JWT Authentication
- [x] Project Management APIs
- [x] freelancer and client chat system
- [x] resume and pdf upload
- [ ] Protected Routes
- [ ] Frontend Integration
- [ ] Messaging System
- [ ] Payment Integration

---

## Future Goals

- Real-time chat
- AI-powered recommendations
- Freelancer ranking system
- Stripe payment gateway
- Notification system
- Admin dashboard

---

## Author

Harshit Pandey
