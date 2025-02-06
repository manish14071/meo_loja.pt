import { pool } from "../config/db.js";



export const productQueries = {
  createProduct: async (productData) => {
    const { 
      name, 
      description, 
      price, 
      category_id, 
      brand,
      stock_count,
      image 
    } = productData;

    const query = `
      INSERT INTO products 
        (name, description, price, category_id, brand, stock_count, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [name, description, price, category_id, brand, stock_count, image];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getPaginatedProducts: async (keyword, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT p.*, c.name as category_name,
             COUNT(*) OVER() as total_count
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name ILIKE $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [`%${keyword}%`, pageSize, offset]);
    return {
      products: result.rows,
      total: result.rows[0]?.total_count || 0
    };
  },

  getAllProducts: async () => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  getProductById: async (id) => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  updateProduct: async (id, productData) => {
    const { 
      name, 
      description, 
      price, 
      category_id, 
      brand,
      stock_count,
      image 
    } = productData;

    let query = `
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          category_id = COALESCE($4, category_id),
          brand = COALESCE($5, brand),
          stock_count = COALESCE($6, stock_count),
          image = COALESCE($7, image),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [name, description, price, category_id, brand, stock_count, image, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deleteProduct: async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getTopProducts: async () => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.rating DESC
      LIMIT 4
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  getNewProducts: async () => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  filterProducts: async ({ categories, minPrice, maxPrice }) => {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let valueIndex = 1;

    if (categories?.length) {
      query += ` AND category_id = ANY($${valueIndex})`;
      values.push(categories);
      valueIndex++;
    }

    if (minPrice !== undefined) {
      query += ` AND price >= $${valueIndex}`;
      values.push(minPrice);
      valueIndex++;
    }

    if (maxPrice !== undefined) {
      query += ` AND price <= $${valueIndex}`;
      values.push(maxPrice);
      valueIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  getProductsByCategory: async (categoryId) => {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  }
};
