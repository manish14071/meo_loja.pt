import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id; // Get productId from URL params

  const checkQuery = `
    SELECT * FROM reviews 
    WHERE user_id = $1 AND product_id = $2
  `;
  const { rows: existing } = await pool.query(checkQuery, [
    req.user.id,
    productId,
  ]);

  if (existing.length > 0) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const query = `
    INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    req.user.id,
    productId, // Ensure productId is used here
    rating,
    comment,
  ]);

  res.status(201).json(rows[0]);
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      r.*,
      u.username,
      u.email
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `;

  const { rows } = await pool.query(query, [req.params.id]);
  res.json(rows);
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
{
  /*}
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const checkQuery = `
    SELECT * FROM reviews 
    WHERE user_id = $1 AND product_id = $2
  `;
  const { rows: existing } = await pool.query(checkQuery, [req.user.id, productId]);

  if (existing.length > 0) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const query = `
    INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    req.user.id,
    productId,
    rating,
    comment,
  ]);

  res.status(201).json(rows[0]);
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      r.*,
      u.username,
      u.email
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `;

  const { rows } = await pool.query(query, [req.params.id]);
  res.json(rows);
});   */
}
