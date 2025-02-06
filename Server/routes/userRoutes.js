import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserStats,
  updateUserAdmin
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);
router.get('/stats', protect, admin, getUserStats);
// Add this route in userRoutes.js
router.put("/:id/admin", protect, admin, updateUserAdmin); // Add this line after the other routes

export default router;
