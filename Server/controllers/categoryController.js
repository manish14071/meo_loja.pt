import asyncHandler from 'express-async-handler';
import { pool } from '../config/db.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const query = 'SELECT * FROM categories ORDER BY name';
  const { rows } = await pool.query(query);
  res.json(rows);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }

  const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
  const { rows } = await pool.query(query, [name]);
  res.status(201).json(rows[0]);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
  const { rows } = await pool.query(query, [name, id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json(rows[0]);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if there are products referencing the category
  const productQuery = 'SELECT * FROM products WHERE category_id = $1';
  const { rows: products } = await pool.query(productQuery, [id]);

  if (products.length > 0) {
    res.status(400);
    throw new Error('Cannot delete category with associated products');
  }

  // Delete the category
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ message: 'Category removed' });
});

export { getCategories, createCategory, updateCategory, deleteCategory };
