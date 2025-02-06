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
import {
  createProductReview,
  getProductReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.get("/", fetchProducts);
router.get("/all", fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/:id", fetchProductById);
router.get("/category/:categoryId", getProductsByCategory);

// Protected routes (admin only)
router.post("/", protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

// Filtering routes
router.post("/filtered-products", getFilteredProducts);

// Stats route
router.get("/stats", protect, admin, getProductStats);

router
  .route("/:id/reviews")
  .get(getProductReviews)
  .post(protect, createProductReview);

export default router;
