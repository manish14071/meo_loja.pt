import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Add this for debugging database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};