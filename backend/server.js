import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Track DB connection status for health checks
let dbConnected = false;

// ✅ Middleware
// Allow common dev origins and provide a permissive fallback in non-production
const allowedOrigins = [
  // local dev
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://172.16.123.3:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://172.16.123.3:5177",

  // ✅ Render frontend (THIS IS THE FIX)
  "https://thinksecure-frontend.onrender.com",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, mobile apps, or same-origin requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    // In development, allow any origin to simplify local testing
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // Otherwise block
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
}));
app.use(express.json());

// Simple request logger to help debug whether requests reach the server
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), dbConnected });
});

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// Also expose the same auth endpoints at `/api/*` so frontend paths
// like POST `/api/register` and POST `/api/login` are available.
// This preserves the existing `/api/auth/*` routes for compatibility.
app.use("/api", authRoutes);

// 404 handler for debugging - log all unmatched routes
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// ✅ MongoDB Connection
const connectDB = async (retries = 3) => {
  try {
    // Bypass strict TLS verification for network issues
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      family: 4, // Force IPv4
    });

    dbConnected = true;
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Connected to database: ${mongoose.connection.name}`);
    return true;
  } catch (err) {
    console.error(`❌ MongoDB connection failed (attempt ${4 - retries}/3):`, err.message);

    if (retries > 0) {
      console.log(`🔄 Retrying in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return connectDB(retries - 1);
    } else {
      dbConnected = false;
      console.error("⚠️ WARNING: Starting server WITHOUT MongoDB - auth features will not work!");
      return false;
    }
  }
};

// ✅ Start the server only after DB connects
const startServer = async () => {
  const dbConnected = await connectDB();
  console.log(`📊 Database status: ${dbConnected ? 'Connected' : 'Failed'}`);

  const PORT = process.env.PORT || 5000;

  return new Promise((resolve) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Server listening on all interfaces (0.0.0.0:${PORT})`);
      console.log(`✅ Backend is ready to accept requests!`);
      resolve(server);
    });

    server.on('error', (err) => {
      console.error(`❌ Server error:`, err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use!`);
        process.exit(1);
      }
    });
  });
};

// Start server and keep it running
startServer().then(() => {
  console.log('🎯 Server initialization complete - Press Ctrl+C to stop');
}).catch((err) => {
  console.error('💥 Server failed to start:', err);
  // In development, avoid hard exit so we can inspect logs; still exit in production
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

// Global error handlers to keep the process alive in development and log useful info
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});
