import { pool } from "../config/db.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { productQueries } from '../models/productModel.js';

// Create Product


// Update Product


// Delete Product


// Get Products with Pagination
export const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 6;
    const keyword = req.query.keyword || '';

    const { products, total } = await productQueries.getPaginatedProducts(keyword, page, pageSize);
    
    res.json({
      products,
      page,
      pages: Math.ceil(total / pageSize),
      hasMore: products.length === pageSize
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Product by ID
export const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await productQueries.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Products
export const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await productQueries.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Top Rated Products
export const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await productQueries.getTopProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get New Products
export const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await productQueries.getNewProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter Products
export const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { categories, priceRange } = req.body;
    const products = await productQueries.filterProducts({
      categories,
      minPrice: priceRange?.[0],
      maxPrice: priceRange?.[1]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Products by Category
export const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const products = await productQueries.getProductsByCategory(req.params.categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      p.*,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;

  try {
    const { rows } = await pool.query(query);
    res.json({
      products: rows,
      page: 1,
      pages: 1
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;

  const { rows } = await pool.query(query, [req.params.id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(rows[0]);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category_id,
    stock_count,
  } = req.body;

  const query = `
    INSERT INTO products (
      name, price, description, image, brand, 
      category_id, stock_count, user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    name,
    price,
    description,
    image,
    brand,
    category_id,
    stock_count,
    req.user.id,
  ];

  const { rows } = await pool.query(query, values);
  res.status(201).json(rows[0]);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category_id,
    stock_count,
  } = req.body;

  const query = `
    UPDATE products
    SET 
      name = $1,
      price = $2,
      description = $3,
      image = $4,
      brand = $5,
      category_id = $6,
      stock_count = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *
  `;

  const values = [
    name,
    price,
    description,
    image,
    brand,
    category_id,
    stock_count,
    req.params.id,
  ];

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(rows[0]);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [req.params.id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ message: 'Product removed' });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.rating DESC
      LIMIT 4
  `;

  const { rows } = await pool.query(query);
  res.json(rows);
});

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = asyncHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_products,
      COUNT(CASE WHEN stock_count > 0 THEN 1 END) as in_stock,
      COUNT(CASE WHEN stock_count = 0 THEN 1 END) as out_of_stock,
      COALESCE(MIN(price), 0) as min_price,
      COALESCE(MAX(price), 0) as max_price,
      COALESCE(AVG(price), 0) as avg_price
    FROM products
  `;

  const { rows } = await pool.query(statsQuery);
  res.json(rows[0]);
});

// @desc    Get filtered and sorted products
// @route   POST /api/products/filter
// @access  Public
export const getFilteredProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    page = 1,
    limit = 12,
  } = req.body;

  let params = [];
  let conditions = [];
  let paramCount = 1;

  if (category) {
    conditions.push(`category_id = $${paramCount}`);
    params.push(category);
    paramCount++;
  }

  if (minPrice !== undefined) {
    conditions.push(`price >= $${paramCount}`);
    params.push(minPrice);
    paramCount++;
  }

  if (maxPrice !== undefined) {
    conditions.push(`price <= $${paramCount}`);
    params.push(maxPrice);
    paramCount++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Validate sortBy to prevent SQL injection
  const validSortColumns = ['name', 'price', 'created_at'];
  const validSortOrders = ['ASC', 'DESC'];
  
  if (!validSortColumns.includes(sortBy)) {
    sortBy = 'created_at';
  }
  
  if (!validSortOrders.includes(sortOrder.toUpperCase())) {
    sortOrder = 'DESC';
  }

  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      p.*,
      c.name as category_name,
      COUNT(*) OVER() as total_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  params.push(limit, offset);

  const { rows } = await pool.query(query, params);

  const totalItems = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    products: rows,
    page,
    pages: totalPages,
    total: totalItems,
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getProductStats,
};
