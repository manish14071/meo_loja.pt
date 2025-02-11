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
import { initializeTables } from "./schemas/schemas/init.js";

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
app.set("trust proxy", 1);

const port = process.env.PORT || 3267;

// Middleware

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(securityHeaders);
app.use(xssProtection);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Add production middleware


// Handle file uploads separately
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith("/api/upload")) {
    express.json({ limit: "50mb" })(req, res, next);
  } else {
    next();
  }
});



// Static files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint

// API documentation - move this before error handlers


// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Root route for API

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET?.slice(-4), // Show only last 4 chars
});

// Error handling

// 404 handler


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
