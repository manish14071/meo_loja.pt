import { pool } from '../Config/db.js';

export const orderQueries = {
  createOrder: async (orderData) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { user_id, total_amount, shipping_address, payment_method, order_items } = orderData;

      const orderQuery = `
        INSERT INTO orders (user_id, total_amount, shipping_address, payment_method)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const orderResult = await client.query(orderQuery, [user_id, total_amount, shipping_address, payment_method]);
      const order = orderResult.rows[0];

      for (const item of order_items) {
        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `, [order.id, item.product_id, item.quantity, item.price]);
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getOrderById: async (id) => {
    const query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getUserOrders: async (userId) => {
    const query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  getAllOrders: async () => {
    const query = `
      SELECT o.*, 
             u.name as user_name,
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name
             )) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, u.name
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  updateOrderStatus: async (id, status) => {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const query = `
      UPDATE orders 
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentStatus, id]);
    return result.rows[0];
  }
};
