import { pool } from '../Config/db.js';

export const categoryQueries = {
  // Create a new category
  createCategory: async (categoryData) => {
    const { name, description } = categoryData;
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [name, description]);
    return result.rows[0];
  },

  // Get all categories
  getAllCategories: async () => {
    const query = 'SELECT * FROM categories ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const { name, description } = categoryData;
    const query = `
      UPDATE categories 
      SET name = $1, 
          description = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, id]);
    return result.rows[0];
  },

  // Delete category
  deleteCategory: async (id) => {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
