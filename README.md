# ⚙️ Task Manager API (TypeScript + Express + PostgreSQL + Prisma + Redis)

<div align="center">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/-argon2-003366?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Joi-FFB703?style=for-the-badge&logoColor=black" />
  <img src="https://img.shields.io/badge/-Helmet-000000?style=for-the-badge&logo=helmet" />
  <img src="https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</div>
</div>

---

## 📖 Introduction

A **production-ready Task Manager REST API** built using **TypeScript**, **Express**, **PostgreSQL**, **Prisma**, and **Redis**.

Designed for scalability, security, and clean architecture with:

* Secure Auth (JWT + Redis blacklist)
* Role-based access
* Full Task management (CRUD + Assign + Complete)
* Comment system
* User management (Admin-only)
* Cloudinary file upload
* Type-safe Prisma ORM
* Centralized validation with Joi
* Enterprise security stack

---

## 🧭 Table of Contents

* [⚙ Tech Stack](#-tech-stack)
* [🔋 Features](#-features)
* [📦 Quick Start](#-quick-start)
* [🌍 Environment Variables](#-environment-variables)
* [🧱 API Modules Overview](#-api-modules-overview)
* [🧪 Testing](#-testing)
* [🛠️ Migration Commands](#-migration-commands)
* [🚀 Deployment on Render](#-deployment-on-render)
* [📜 Scripts](#-scripts)
* [🔒 Security](#-security)
* [📄 License](#-license)

---

## ⚙ Tech Stack

| Technology                     | Purpose                      |
| ------------------------------ | ---------------------------- |
| **Node.js**                    | JavaScript Runtime           |
| **TypeScript**                 | Type Safety                  |
| **Express.js**                 | HTTP Server Framework        |
| **PostgreSQL**                 | Primary Database             |
| **Prisma ORM**                 | Type-safe DB operations      |
| **Redis**                      | Caching + Token invalidation |
| **JWT**                        | Authentication mechanism     |
| **argon2**                     | Password hashing             |
| **Joi**                        | Validation library           |
| **Cloudinary**                 | Media uploads                |
| **Multer**                     | File handling                |
| **Helmet / CORS / Rate Limit** | Security                     |
| **Jest + Supertest**           | Testing                      |

---

## 🔋 Features

### 🔐 Authentication & Authorization

* JWT authentication
* Redis token invalidation (logout)
* Argon2 password hashing
* Role-based access control (Admin/User)

### 👤 User Management

* Admin-only user operations
* Update roles
* Upload profile picture
* Delete users

### 📋 Task Management

* CRUD operations
* Assign tasks to users
* Mark as completed
* Owner/Role-based filtering

### 💬 Comments

* Add task comments
* Fetch comments
* Delete comments

---

## 🌍 Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRE=7d

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## 📦 Quick Start

### 1️⃣ Clone Repo

```bash
git clone https://github.com/shasbinas/task-manager-api-ts.git
cd task-manager-api-ts
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Database

```bash
npm run prisma:migrate
npx prisma generate
```

### 4️⃣ Start Development

```bash
npm run dev
```

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

## 🧪 Testing

Run all tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

## 🛠️ Migration Commands

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## 🚀 Deployment on Render

1. Add environment variables
2. Use build command:

```bash
npm run build && npx prisma migrate deploy
```

3. Start command:

```bash
npm start
```

---

## 📜 Scripts

```json
"dev": "tsx watch src/server.ts",
"build": "tsc -p tsconfig.build.json",
"start": "node dist/server.js",
"lint": "eslint src --ext .ts",
"lint:fix": "eslint src --ext .ts --fix",
"format": "prettier --write src",
"prisma:migrate": "prisma migrate dev",
"test": "cross-env NODE_ENV=test jest",
"test:watch": "cross-env NODE_ENV=test jest --watch"
```

---

## 🔒 Security

* Helmet
* CORS
* Rate Limiter
* Redis token blacklist
* Joi request validation
* Argon2 password hashing

---

## 📄 License

MIT License — Free to use and mo
