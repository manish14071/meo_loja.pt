import { userQueries } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import asyncHandler from 'express-async-handler';

// Auth user & get token
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userQueries.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isadmin: user.isadmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await userQueries.getUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await userQueries.createUser({
      username,
      email,
      password,
      isadmin: false,
   
    });

    if (user) {
      try {
        const token = generateToken(user.id);
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          isadmin: user.isadmin,
          token,
        });
      } catch (tokenError) {
        console.error('Token generation error:', tokenError);
        res.status(500).json({ message: 'Error generating authentication token' });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await userQueries.getUserById(req.user.id);
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isadmin: user.isadmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await userQueries.updateUser(req.user.id, req.body);
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isadmin: user.isadmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COALESCE(COUNT(CASE WHEN isadmin = true THEN 1 END), 0) as admin_count,
        COALESCE(COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END), 0) as new_users_last_week,
        COALESCE(COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END), 0) as new_users_last_month,
        MIN(created_at) as first_user_date,
        MAX(created_at) as latest_user_date
      FROM users
    `;

    const { rows } = await pool.query(statsQuery);
    
    if (!rows[0]) {
      return res.status(404).json({ message: 'No user statistics found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// Update the getUsers function to include more details
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.isadmin,
        u.created_at,
        COALESCE(
          (
            SELECT COUNT(*) 
            FROM orders 
            WHERE user_id = u.id
          ), 0
        ) as order_count
      FROM users u
      ORDER BY u.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await userQueries.deleteUser(req.params.id);
    if (user) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout user / clear cookie
export const logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isadmin } = req.body;
    
    const user = await userQueries.updateUserAdmin(userId, isadmin);

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isadmin: user.isadmin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({ message: error.message });
  }
};