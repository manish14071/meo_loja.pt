import express from "express";
import {
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  fetchTopProducts,
  fetchNewProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getFilteredProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", fetchProducts);
router.get("/all", fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/:id", fetchProductById);
router.get("/category/:categoryId", getProductsByCategory);

// Protected routes (admin only)
router.post("/", protect, admin, upload.single('image'), createProduct);

// Handle image upload separately
router.put("/:id", protect, admin, upload.single('image'), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

// Filtering routes
router.post("/filtered-products", getFilteredProducts);

// Stats route
router.get("/stats", protect, admin, getProductStats);

export default router;
