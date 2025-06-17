export const corsOptions = {
  origin: 'https://time-capsule-unlock.vercel.app',
  // origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,                        
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}    