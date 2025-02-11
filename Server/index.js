import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import {
  limiter,
  securityHeaders,
  xssProtection,
  corsOptions,
} from "./middleware/securityMiddleware.js";
import { connectDB } from "./config/db.js";
import { initializeTables } from "./db/schemas/init.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Create uploads temp directory
const uploadsTemp = "./uploads/temp";
if (!fs.existsSync(uploadsTemp)) {
  fs.mkdirSync(uploadsTemp, { recursive: true });
}

const app = express();
const port = process.env.PORT || 3267;

// Middleware

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(securityHeaders);
app.use(xssProtection);
app.use(limiter);

// Add production middleware
if (process.env.NODE_ENV === 'production') {
  // Security headers for production
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// Handle file uploads separately
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith("/api/upload")) {
    express.json({ limit: "50mb" })(req, res, next);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith("/api/upload")) {
    express.urlencoded({ extended: true, limit: "50mb" })(req, res, next);
  } else {
    next();
  }
});

// Static files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API documentation - move this before error handlers
app.get('/api-docs', (req, res) => {
  res.json({
    name: "Meo-Loja API",
    version: "1.0.0",
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://meo-loja-pt.onrender.com/api'
      : 'http://localhost:3267/api',
    endpoints: {
      auth: {
        login: "POST /api/users/auth",
        register: "POST /api/users",
        logout: "POST /api/users/logout",
        profile: "GET /api/users/profile"
      },
      products: {
        list: "GET /api/products",
        single: "GET /api/products/:id",
        create: "POST /api/products",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id"
      },
      categories: {
        list: "GET /api/category",
        create: "POST /api/category",
        update: "PUT /api/category/:id",
        delete: "DELETE /api/category/:id"
      },
      orders: {
        list: "GET /api/orders",
        create: "POST /api/orders",
        getById: "GET /api/orders/:id",
        updateToPaid: "PUT /api/orders/:id/pay"
      },
      upload: {
        image: "POST /api/upload"
      }
    },
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Root route for API
app.get('/', (req, res) => {
  res.json({
    message: 'Meo-Loja API is running',
    docs: '/api-docs',
    health: '/health'
  });
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET?.slice(-4), // Show only last 4 chars
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Initialize database and start server
connectDB().then(async () => {
  try {
    await initializeTables();
    console.log("Database tables initialized");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Error initializing tables:", error);
  }
});

export default app;
