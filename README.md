# 🎟️ Eventra – Scalable Event Ticketing Backend

Eventra is a **backend-focused event ticketing system** built to demonstrate real-world backend engineering concepts such as **authentication**, **concurrency control**, **distributed locking**, **transaction management**, and **asynchronous processing**.

This project intentionally focuses on **backend scalability and correctness** rather than frontend UI.  
All APIs are fully documented and testable via **Swagger (OpenAPI)**.

---

## 🚀 Features Implemented

### 🔐 Authentication & Authorization
- JWT-based authentication (Access & Refresh tokens)
- Secure password hashing using bcrypt
- Logout with refresh token invalidation
- Role-Based Access Control (Admin / User)

---

### 🗄️ Hybrid Database Architecture
- **PostgreSQL**
  - Users
  - Seats
  - Bookings
- **MongoDB**
  - Event details (flexible schema)
- **Redis**
  - Seat locks
  - Booking hold TTL
  - Caching and rate-limiting support

---

### 🎟️ Seat Booking System (Core Feature)
- Concurrency-safe seat booking
- Redis **distributed locks** to prevent double booking
- PostgreSQL **row-level locking (`SELECT FOR UPDATE`)**
- Atomic transactions using `BEGIN / COMMIT / ROLLBACK`
- Booking lifecycle:
  - `HELD`
  - `CONFIRMED`
  - `EXPIRED`

---

### ⏱️ Auto Seat Release (Timeout Handling)
- Seats are temporarily held for a fixed duration (e.g. 10 minutes)
- Redis TTL automatically expires booking holds
- Background worker listens to Redis key expiry events
- On expiry:
  - Booking marked as `EXPIRED`
  - Seat released back to inventory

---

### 💳 Payment Flow (Mock)
- Payment confirmation endpoint
- Transitions booking from `HELD → CONFIRMED`
- Cancels Redis TTL to prevent auto-release
- Fully transaction-safe

---

### 📧 Asynchronous Email Notifications
- Implemented using **BullMQ (Redis-backed job queue)**
- Emails sent in background after successful payment
- Keeps API responses fast and non-blocking

---

### ⚡ Performance & Protection
- Redis caching for read-heavy endpoints
- Rate limiting using Redis
- Distributed locking for critical booking sections

---

### 📘 API Documentation
- Swagger (OpenAPI 3.0) documentation
- Interactive API testing via `/api-docs`
- JWT authorization supported inside Swagger

---

### 🐳 Dockerized Infrastructure
- Docker & Docker Compose used for:
  - Node.js API
  - PostgreSQL
  - MongoDB
  - Redis
- One-command setup for the entire backend stack

---

## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | Node.js, Express |
| Authentication | JWT, bcrypt |
| Databases | PostgreSQL, MongoDB |
| Cache & Locks | Redis |
| Queue | BullMQ |
| Documentation | Swagger (OpenAPI) |
| DevOps | Docker, Docker Compose |

---

## 📁 Project File Structure

eventra/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
├── README.md
│
├── src/
│   ├── server.js                # Application entry point
│   ├── app.js                   # Express app setup & route registration
│
│   ├── config/                  # Configuration files
│   │   ├── postgres.js          # PostgreSQL connection
│   │   ├── redis.js             # Redis client (cache, locks, TTL)
│   │   ├── bullmq.redis.js      # Redis config for BullMQ
│   │   └── swagger.js           # Swagger / OpenAPI configuration
│
│   ├── middlewares/             # Global middlewares
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── role.middleware.js   # Role-based access control
│   │   └── rateLimiter.middleware.js
│
│   ├── utils/
│   │   └── redisLock.js         # Distributed Redis lock helper
│
│   ├── queues/
│   │   └── email.queue.js       # BullMQ email producer
│
│   ├── workers/
│   │   ├── seatExpiry.worker.js # Auto seat release worker (Redis TTL)
│   │   └── email.worker.js      # Email sending worker
│
│   ├── modules/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── events/
│   │   │   ├── events.routes.js
│   │   │   ├── events.controller.js
│   │   │   └── events.model.js  # MongoDB model
│   │   │
│   │   ├── bookings/
│   │   │   ├── bookings.routes.js
│   │   │   └── bookings.controller.js
│   │   │
│   │   └── payments/
│   │       ├── payments.routes.js
│   │       └── payments.controller.js
│
│   └── database/
│       └── seed.sql             # Initial DB seed (seats, sample data)



---

## 🔄 Seat Booking Flow (High Level)

1. User requests seat booking
2. Redis lock acquired for `(eventId + seatNumber)`
3. PostgreSQL transaction begins
4. Seat checked using row-level lock
5. Seat marked as booked
6. Booking created with status `HELD`
7. Redis TTL key created for auto-expiry
8. Transaction committed
9. Lock released

If payment is successful:
- Booking → `CONFIRMED`
- Redis TTL cancelled

If timeout occurs:
- Booking → `EXPIRED`
- Seat released automatically

---

Swagger supports:
- JWT authorization
- Protected route testing
- Request/response schemas

---

