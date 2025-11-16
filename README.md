# ⚙️ Task Manager API (TypeScript + Express + PostgreSQL + Redis)

<div align="center">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/-argon2-003366?style=for-the-badge&logo=security&logoColor=white" alt="argon2" />
  <img src="https://img.shields.io/badge/-Joi-FFB703?style=for-the-badge&logo=javascript&logoColor=black" alt="Joi Validation" />
  <img src="https://img.shields.io/badge/-Helmet-000000?style=for-the-badge&logo=helmet&logoColor=white" alt="Helmet" />
</div>

---

## 🧭 Table of Contents

- [📖 Introduction](#-introduction)
- [⚙ Tech Stack](#-tech-stack)
- [🔋 Features](#-features)
- [📦 Quick Start](#-quick-start)
- [🚀 Deployment on Render](#-deployment-on-render)
- [🧱 API Modules Overview](#-api-modules-overview)

---

## 📖 Introduction

This project is a **production-ready Task Manager REST API** built with **TypeScript**, **Express**, and **PostgreSQL**.  
It features comprehensive **task management**, **user authentication**, **role-based access control**, and **real-time caching with Redis**.

Designed with scalability, security, and maintainability in mind.

---

## ⚙ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js** | JavaScript runtime |
| **TypeScript** | Static typing for robust code |
| **Express.js** | Web framework for REST APIs |
| **PostgreSQL** | Relational database |
| **Prisma** | Modern ORM for database management |
| **Redis** | Caching and session management |
| **JWT** | Secure authentication |
| **argon2** | Password hashing |
| **Joi** | Request validation |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **Morgan** | HTTP request logging |
| **ESLint + Prettier** | Code quality and formatting |

---

## 🔋 Features

✅ **JWT-based Authentication with Redis Session Management**  
✅ **Role-based Access Control (Admin / User)**  
✅ **Complete Task Management (CRUD + Assign + Complete)**  
✅ **Task Comments System**  
✅ **User Management (Admin only)**  
✅ **Request Validation with Joi**  
✅ **Rate Limiting for API Protection**  
✅ **Secure Password Hashing with argon2**  
✅ **Redis Caching for Performance**  
✅ **Centralized Error Handling**  
✅ **TypeScript + Prisma Type Safety**  
✅ **Security Best Practices (Helmet, CORS, Compression)**

---

## 📦 Quick Start

### 1️⃣ Clone the repository
```bash
git clone https://github.com/shasbinas/task-manager-api-ts.git
cd task-manager-api-ts
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables (.env)

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRE=7d

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

### 4️⃣ Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npx prisma db seed
```

### 5️⃣ Start the server
```bash
npm run dev      # Development mode (with tsx watch)
npm run build    # Build TypeScript to dist/
npm start        # Run production build
```

---

Server will run on:  
👉 **http://localhost:5000**

---

## 🚀 Deployment on Render

1. **Create PostgreSQL Database** on Render
2. **Create Redis Instance** on Render
3. **Deploy Web Service** and set environment variables
4. **Build Command**: `npm run build && npx prisma migrate deploy`
5. **Start Command**: `npm start`

---

## 🧱 API Modules Overview

### 🔐 Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT token |
| `POST` | `/logout` | Logout and invalidate session |

---

### 👤 User Routes — `/api/users` (Admin Only)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/` | Get all users |
| `GET` | `/:id` | Get user by ID |
| `PUT` | `/:id/role` | Update user role |
| `DELETE` | `/:id` | Delete user |

---

### 📋 Task Routes — `/api/tasks`
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/` | Create a new task |
| `GET` | `/` | Get all tasks (filtered by user) |
| `GET` | `/:id` | Get task by ID |
| `PUT` | `/:id` | Update task |
| `DELETE` | `/:id` | Delete task |
| `PUT` | `/:id/complete` | Mark task as complete |
| `PUT` | `/:id/assign` | Assign task to user |

---

### 💬 Comment Routes — `/api/comments`
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/tasks/:taskId/comments` | Add comment to task |
| `GET` | `/tasks/:taskId/comments` | Get all comments for task |
| `DELETE` | `/comments/:id` | Delete comment |

---

## 🧑‍💻 Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Start development server with watch mode |
| `npm run build` | Compile TypeScript files |
| `npm start` | Run compiled app (production) |
| `npm run lint` | Lint all TypeScript files |
| `npm run lint:fix` | Fix lint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run prisma:migrate` | Run Prisma migrations |

---

## 🔒 Security Features

- **Helmet.js** for secure HTTP headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **argon2** password hashing
- **JWT** token-based authentication
- **Redis session** management
- **Request validation** with Joi

---
If you like this project, **please ⭐ star the repo!**

**Repository:** [github.com/shasbinas/task-manager-api-ts](https://github.com/shasbinas/task-manager-api-ts)