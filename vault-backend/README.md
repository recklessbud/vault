# Capsule Backend

A secure backend service for Capsule – a digital vault app for storing sensitive data. Built with **TypeScript**, **Express**, **PostgreSQL**, **Prisma ORM**, **Redis**, **JWT Auth**, **AWS** and deployed with **Docker** running on **Render**.

---

## 🔧 Tech Stack

- **Node.js** & **Express**
- **TypeScript**
- **PostgreSQL** (via Prisma ORM)
- **Redis** for caching and rate limiting
- **JWT** Authentication
- **Docker** + `docker-compose`
- **Nginx** as reverse proxy (optional)
- **EJS** (used during dev testing before React)
- **AWS** used s3 buckets to store the images

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
- git clone https://github.com/recklessbud/vault/vault-backend.git
- cd vault-backend
- npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following content:

```
PORT=8001
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:yourpassword@db:5432/time-capsule
BUCKET_NAME=your_bucket_name
BUCKET_REGION=your_bucket_region
S3_ACCESS_KEY=your_s3_access_key
S3_ACCESS_SECRET=your_s3_access_secret
NODE_ENV=production
REDIS_URL=redis://your_redis_url:6379
REDIS_HOST=your_redis_host
REDIS_PORT=6379
ENCRYPTION_KEY=your_encryption_key
ENCRYPTION_LENGTH=16
EMAIL_PASSWORD=your_email_password
EMAIL_SECRET=your_email_secret
EMAIL_STRING=your_email_address
RESET_TOKEN_SECRET=your_reset_token_secret
RESET_TOJEN_EXPIRES_IN=15m
```

### 3. Run with Docker

Start all services using Docker Compose:

```bash
docker-compose up --build
```

This will spin up:

- The Express server
- A PostgreSQL database
- A Redis instance
- The Background Job to Unlock the vaults

You can access the backend at:  
📍 http://localhost:8001

## 4. 🔐 Authentication Flow

- Register/Login returns both `accessToken` (in headers/localStorage) and `refreshToken` (HttpOnly cookie).
- Access tokens are short-lived; refresh tokens are used to re-authenticate.
- Middleware guards all protected routes.

## 📚 API Documentation

Coming soon...

---

## 🛠 Troubleshooting

- If you encounter any issues, please make sure that all services (PostgreSQL, Redis, etc.) are running and accessible.
- Check the logs for any error messages or stack traces that can help identify the problem.
- Ensure that your environment variables are correctly set in the `.env` file.

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries, please contact [bureck400@gmail.com](mailto:bureck400@gmail.com).
