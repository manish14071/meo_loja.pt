import asyncHandler from 'express-async-handler';
import { pool } from '../config/db.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create order
    const orderQuery = `
      INSERT INTO orders (user_id, payment_method, total_price, shipping_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const orderValues = [req.user.id, paymentMethod, totalPrice, shippingAddress];
    const { rows: [order] } = await client.query(orderQuery, orderValues);

    // Create order items
    const orderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;
    
    for (const item of orderItems) {
      await client.query(orderItemsQuery, [
        order.id,
        item.product,
        item.qty,
        item.price,
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      o.*,
      json_agg(
        json_build_object(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product', json_build_object(
            'name', p.name,
            'image', p.image
          )
        )
      ) as order_items,
      u.username as user_name,
      u.email as user_email
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
    GROUP BY o.id, u.username, u.email
  `;

  const { rows } = await pool.query(query, [req.params.id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(rows[0]);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const query = `
    UPDATE orders 
    SET is_paid = true, paid_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [req.params.id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(rows[0]);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const query = `
    UPDATE orders 
    SET is_delivered = true, delivered_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [req.params.id]);

  if (rows.length === 0) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(rows[0]);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const query = `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await pool.query(query, [req.user.id]);
  res.json(rows);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      o.*,
      u.username as user_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  const { rows } = await pool.query(query);
  res.json(rows);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
