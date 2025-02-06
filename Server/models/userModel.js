import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const userQueries = {
  createUser: async ({ username, email, password,isadmin }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password,isadmin)
      VALUES ($1, $2, $3,$4)
      RETURNING id, username, email, isadmin 
    `;
    
    try {
      const { rows } = await pool.query(query, [username, email, hashedPassword,isadmin]);
      return rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    const query = `
      SELECT id, username, email, password, isadmin 
      FROM users
      WHERE email = $1
    `;
    
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  getUserById: async (id) => {
    const query = `
      SELECT id, username, email, isadmin 
      FROM users 
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  updateUser: async (id, userData) => {
    const { username, email, password } = userData;
    let query, values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET username = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, username, email, isadmin
      `;
      values = [username, email, hashedPassword, id];
    } else {
      query = `
        UPDATE users 
        SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, username, email, isadmin
      `;
      values = [username, email, id];
    }

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  getAllUsers: async () => {
    const query = `
      SELECT id, username, email, isadmin "
      FROM users 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  deleteUser: async (id) => {
    const query = `
      DELETE FROM users 
      WHERE id = $1 
      RETURNING id, username, email, isadmin 
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },


  updateUserAdmin: async (id, isadmin) => {
    const query = `
      UPDATE users 
      SET isadmin = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, username, email, isadmin
    `;
    
    try {
      const { rows } = await pool.query(query, [isadmin, id]);
      return rows[0];
    } catch (error) {
      console.error('Error updating user admin status:', error);
      throw error;
    }
  }
};

// Add this to userQueries object in userModel.js
