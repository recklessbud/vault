# 🧠 Capsule – A Digital Memory Vault

Capsule is a secure and personal **digital memory vault** that helps users preserve, manage, and revisit important moments, ideas, and digital keepsakes. Built with a focus on privacy, simplicity, and security, Capsule is the place to **store your thoughts, safely**.

**URL**: https://time-capsule-unlock.vercel.app

---

## Test Account
- Username: smoke123
- password: guyguyguy 

## 🎯 Purpose of the Project

In today’s fast-paced digital world, memories, thoughts, and notes often get lost in the chaos. Capsule solves this by providing a **private, encrypted, and structured space** where users can:

- Save personal entries (text, media, etc.)
- Categorize and manage vault items
- Revisit important memories over time
- Access their capsule across devices securely

It’s more than a note-taking app. It’s your **digital time capsule**.

---

## 💡 Key Features

- 🔐 **Secure Authentication** using JWT
- 🗄️ **Vault System** to organize user data
- 📦 **Prisma ORM** with PostgreSQL for relational data
- 🚀 **RESTful API** built with TypeScript & Express
- ♻️ **Refresh Token Logic** for long sessions
- 📡 **Redis** support for caching and session rate-limiting
- 🌐 **Deployed via Docker**, with optional NGINX reverse proxy
- 📱 Designed with future frontend support (React or mobile)

---

## 🧱 Built With

| Tech        | Usage                            |
|-------------|----------------------------------|
| Node.js + Express | Backend server              |
| TypeScript  | Type-safe development             |
| PostgreSQL + Prisma | Database and ORM         |
| Redis       | Caching, rate-limiting, sessions |
| Docker      | Containerized deployment         |
| JWT         | Auth system                      |
| React       | Frontend                         
| AWS         | loud service for file storage (s3)|
| Jest        | Unit Testing                      |


---

## 🔐 Authentication Flow

- **Login/Register** → returns Access & Refresh Tokens
- **Access Token** → short-lived, stored in headers/localStorage
- **Refresh Token** → long-lived, stored in HttpOnly cookies
- Secured routes are validated with a middleware that decodes JWT

---

## 📂 Project Modules

- `/auth` – Register, login, logout, refresh
- `/users` – Protected routes, like dashboard
- `/vault` – User’s secure memory entries
- `/jobs` – Background jobs like cleanup
- `/middlewares` – Auth, error handling, rate limiting

---

## 📦 Deployment Strategy

- Use `Docker Compose` to spin up:
  - App server
  - PostgreSQL
  - Redis
  - Nginx proxy (optional)
  - Background job
- Backend exposed on `PORT 8001` (proxied through Nginx or Render)
- Environment variables configured via `.env`

---

## 📱 Future Plans

- 🔄 Switch to a full React or mobile frontend
- 🧾 Add file/media uploads to vault
- 🔔 Add email reminders using background jobs
- 🧠 AI integration to summarize memory entries
- 🌍 Multi-user sharing (like shared capsules)

---

## 🧪 Status

✔️ Authentication  
✔️ Vault creation & retrieval  
✔️ Redis setup  
✔️ Dockerized backend  
✔️ Mobile & Desktop tested  
🛠️ iOS cookie handling in progress  
🛠️ Frontend migration from EJS to React underway

---

## 🧔‍♂️ Author

**Bud Reckless**  
DevOps & Backend Engineer passionate about building secure, focused, and scalable products.

[GitHub](https://github.com/recklessbud)

---

## 📜 License

This project is licensed under the MIT License – free to use, share, and contribute.

