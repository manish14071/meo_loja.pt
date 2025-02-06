import dotenv from "dotenv"
dotenv.config()

import path from "path"
import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs'
//import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { limiter, securityHeaders, xssProtection, corsOptions } from './middleware/securityMiddleware.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import multer from "multer"

//utils

import { connectDB } from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import { initializeTables } from './db/schemas/init.js'
//import fileUpload from "express-fileupload"



const port=process.env.PORT || 3267;

connectDB().then(async () => {
  try {
    await initializeTables();
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
});

const app=express();
app.use(cors(corsOptions));

// Only parse JSON and URL-encoded bodies for non-upload routes.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/upload')) {
    // Skip JSON parsing for upload routes (handled by multer)
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/upload')) {
    // Skip URL-encoded parsing for upload routes (handled by multer)
    next();
  } else {
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  }
});

// CORS should be first
app.use(cookieParser())




// Body parsing middleware
//app.use(express.json())
//app.use(express.urlencoded({extended:true}))




// Security middleware
app.use(securityHeaders);
app.use(xssProtection);
app.use(limiter);


// Static files

// Create uploads directory if it doesn't exist

// API routes
app.use("/api/users",userRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/products", productRoutes)
app.use('/api/upload', uploadRoutes);
app.use("/api/orders",orderRoutes)

app.get("/api/config/paypal",(req,res)=>{
    res.send({clientId:process.env.PAYPAL_CLIENT_ID});
});

app.get('/api-docs', (req, res) => {
  res.json({
    apiVersion: '1.0',
    endpoints: {
      users: '/api/users',
      categories: '/api/category',
      products: '/api/products',
      orders: '/api/orders',
      upload: '/api/upload'
    }
  });
});
const __dirname=path.resolve()
app.use("/uploads",express.static(path.join(__dirname + "uploads")));
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port,()=>console.log(`server is running on port  ${port}`))
    