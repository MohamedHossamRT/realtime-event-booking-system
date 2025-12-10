# Pulse Booking | Real-Time Reservation Engine

**Pulse Booking** is a high-performance, event-driven reservation system designed to handle high-concurrency booking scenarios. It solves the classic **"Double-Booking Problem"** using a hybrid state architecture (Redis + MongoDB) and atomic locking mechanisms.

This project serves as a **Performance & Complexity Proof** delivering a real-time experience to users.

-----

## 🏗 System Architecture

The system utilizes a **Hybrid State Management** strategy. High-frequency operations (locking/unlocking seats) are offloaded to an in-memory store (Redis) to ensure speed and atomicity, while persistent data is strictly managed in MongoDB.

<img width="909" height="1066" alt="System Architecture" src="https://github.com/user-attachments/assets/5be03058-412d-411b-a39b-b8df546afeef" />


### The Data Flow

1.  **Hot State (Redis):** Handles temporary locks. Used for the "Select Seat" action.
2.  **Cold State (MongoDB):** Stores permanent records (Events, Users, Finalized Bookings).
3.  **Real-Time Bridge (Socket.io):** Broadcasts state changes (`seat_locked`, `seat_released`, `seats_booked`) instantly to all connected clients.

-----

## 🛠 Backend Engineering Principles

The backend is built on a **Service-Oriented MVC Architecture** to ensure separation of concerns and testability.

<img width="1817" height="739" alt="Backend Design" src="https://github.com/user-attachments/assets/e256b4db-409a-4aea-aed2-73a9737a2604" />


### 1\. Concurrency Control (The "Double-Booking" Solution)

To prevent two users from booking the same seat simultaneously, the system implements **Atomic Locking**:

  * **Redis Mutex:** We use `SET resource_id user_id NX EX 600`.
      * `NX`: Only set if the key does *not* exist (Atomic check-and-set).
      * `EX`: Auto-expire after 10 minutes (Prevents deadlocks if a user crashes).
  * **Optimistic Locking:** On final checkout, we verify the lock ownership before writing to MongoDB.

### 2\. Defensive Programming

The system assumes inputs are malicious and networks are unreliable:

  * **Zod Validation:** Strict schema validation for both HTTP bodies AND WebSocket payloads.
  * **Rate Limiting:** Brute-force protection on Auth routes.
  * **Global Error Handling:** Centralized error controller that masks stack traces in production.

### 3\. Modular & Scalable Code

  * **Singleton Pattern:** Used for Database and Socket connections to prevent connection leaks.
  * **Service Layer:** Business logic is decoupled from HTTP transport, allowing reusability.

-----

## 🎨 Frontend Experience (UI/UX)

The frontend is built for **Speed and Reliability**. It focuses on dynamic updates to make the application feel instant, while handling potential server rejections gracefully.

  * **Smart State Sync:** Merges "Server State" (MongoDB) with "Live State" (Redis) to render the Seat Map.
  * **Visual Feedback:**
      * **Blue:** Selected by Me.
      * **Pulsing Gray:** Locked by Another User (Real-time).
      * **Red:** Booked.
  * **Tech:** React 18, TypeScript, Tailwind CSS, Shadcn UI, Zustand (Client State), TanStack Query (Server State).

-----

## 🚀 Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Backend** | Node.js / Express | REST API & Application Logic |
| **Real-Time** | Socket.io | Bi-directional communication |
| **Persistence** | MongoDB (Mongoose) | Durable data storage |
| **Caching/Locking** | Redis (ioredis) | Atomic locks & hot state |
| **Frontend** | React + Vite | SPA Framework |
| **Styling** | Tailwind + Shadcn | Responsive Design System |
| **State** | Zustand + React Query | State Management |
| **Security** | JWT + Bcrypt + Helmet | Authentication & Security Headers |

-----

## 🔌 API Documentation

### Authentication

  * `POST /api/v1/users/signup` - Register a new user.
  * `POST /api/v1/users/login` - Authenticate and receive JWT.

### Events (Admin)

  * `POST /api/v1/events` - Create an event and auto-generate seat grid.
  * `GET /api/v1/events` - List all active events.

### Booking Engine

  * `GET /api/v1/events/:id/seats` - Fetch merged seat map (Mongo + Redis).
  * `POST /api/v1/events/:id/seats` - Finalize booking (Atomic transaction).
  * `GET /api/v1/bookings/me` - View user booking history.

-----

## Local Installation

### Prerequisites

  * Node.js (v18+)
  * MongoDB (Local or Atlas)
  * Redis (Local or Cloud)

### 1\. Backend Setup

```bash
cd Server
npm install
# Create .env file with:
# PORT=5000
# DATABASE_URL=mongodb://localhost:27017/pulsebooking
# REDIS_HOST=localhost
# JWT_SECRET=your_secret
npm run dev
```

### 2\. Frontend Setup

```bash
cd Client
npm install
npm run dev
```

-----

## Future Roadmap

  * [ ] **Payment Gateway:** Integration with Stripe for payment processing.
  * [ ] **Email Notifications:** Send ticket confirmation emails using NodeMailer.

-----

### Author

**Mohamed Hossam**
*Software Engineer | Full Stack Developer*
*Specializing in High-Performance, Scalable Architectures.*
