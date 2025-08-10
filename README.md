
# 📱 ChatLoop – Real-time Chat Application

ChatLoop is a **real-time chat application** built with **Next.js**, **NestJS**, **PostgreSQL**, **Redis**, and **Socket.IO**.
It supports **room-based messaging**, **live updates**, and **instant communication**.

---

## 🚀 Features

* **Real-time Messaging** – Powered by Socket.IO
* **Room-based Chats** – Create and join chat rooms
* **User Authentication** – Secure login and registration
* **Persistent Storage** – Messages stored in PostgreSQL
* **Fast Data Access** – Redis caching for scalability
* **Modern UI** – Built with Next.js + Tailwind CSS
* **TypeScript** – Full type safety on backend & frontend

---

## 🛠 Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| **Frontend** | Next.js, Tailwind CSS, Socket.IO Client |
| **Backend**  | NestJS, Socket.IO Server                |
| **Database** | PostgreSQL (Prisma ORM)                 |
| **Cache**    | Redis                                   |
| **Auth**     | Jwt Authentication                 |
| **Language** | TypeScript                              |

---

## 📂 Project Structure

```
chatloop/
│
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── chat/
│   │   │   ├── chat.gateway.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── prisma/
│   ├── prisma/schema.prisma
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/chatloop.git
cd chatloop
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables** (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatloop"


**Run Database Migrations**

```bash
npx prisma migrate dev
```

**Start Backend**

```bash
npm run start:dev
```

Backend runs on **[http://localhost:3000](http://localhost:3000)**

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

**Configure Environment Variables** (`.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

**Start Frontend**

```bash
npm run dev
```

Frontend runs on **[http://localhost:3001](http://localhost:3001)**

---

## 🧪 Testing API with Thunder Client

* **Check Backend Health**
  `GET http://localhost:3000`
* **Send Message**
  `POST http://localhost:3000/messages`
* **Connect via WebSocket**
  `ws://localhost:3000/socket.io/`

---

## 📌 Usage

1. Start **Backend** and **Frontend**
2. Open `http://localhost:3001`
3. Create a room and invite users
4. Chat in real-time 🎯

---

## 📸 Screenshots

| Home Page                     | Chat Room                     |
| ----------------------------- | ----------------------------- |
| ![Home](screenshots/home.png) | ![Chat](screenshots/chat.png) |

---



1. **API Endpoints Table** (for REST endpoints in NestJS)
2. **Detailed Socket Event Documentation** (for every event our frontend and backend use)

---

## ** API Endpoints Table**

| Method   | Endpoint            | Description                                             | Request Body                             | Response                                           |
| -------- | ------------------- | ------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| **POST** | `/auth/register`    | Registers a new user                                    | `{ username: string, password: string }` | `{ id, username, createdAt }`                      |
| **POST** | `/auth/login`       | Logs in a user and returns a JWT token                  | `{ username: string, password: string }` | `{ token: string }`                                |
| **GET**  | `/rooms`            | Lists all chat rooms                                    | None                                     | `[ { id, name, createdAt } ]`                      |
| **POST** | `/rooms`            | Creates a new chat room                                 | `{ name: string }`                       | `{ id, name, createdAt }`                          |
| **GET**  | `/messages/:roomId` | Fetches all messages for a room                         | None                                     | `[ { id, content, senderId, roomId, createdAt } ]` |
| **POST** | `/messages`         | Sends a new message via REST (alternative to WebSocket) | `{ content, senderId, roomId }`          | `{ id, content, senderId, roomId, createdAt }`     |

---

## ** Detailed Socket Event Documentation**

### **Client → Server Events**

| Event Name    | Payload                                                 | Description                                          |
| ------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `joinRoom`    | `{ roomId: string, userId: string }`                    | User joins a specific chat room.                     |
| `leaveRoom`   | `{ roomId: string, userId: string }`                    | User leaves a specific chat room.                    |
| `sendMessage` | `{ content: string, senderId: string, roomId: string }` | Sends a new message to the server to be broadcasted. |

---

### **Server → Client Events**

| Event Name   | Payload                                                                                | Description                                          |
| ------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `roomJoined` | `{ roomId: string, userId: string }`                                                   | Confirms that the user successfully joined the room. |
| `roomLeft`   | `{ roomId: string, userId: string }`                                                   | Confirms that the user left the room.                |
| `newMessage` | `{ id: string, content: string, senderId: string, roomId: string, createdAt: string }` | Broadcasts a new message to all clients in the room. |
| `error`      | `{ message: string }`                                                                  | Sends an error message from the server.              |

---



## 📜 License

This project is licensed under the **MIT License**.

