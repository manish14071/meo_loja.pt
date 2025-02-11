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

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// PayPal config
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// API documentation
app.get("/api-docs", (req, res) => {
  res.json({
    apiVersion: "1.0",
    endpoints: {
      users: "/api/users",
      categories: "/api/category",
      products: "/api/products",
      orders: "/api/orders",
      upload: "/api/upload",
    },
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
