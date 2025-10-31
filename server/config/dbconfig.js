import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_PSQL,
  ssl: { require: true, rejectUnauthorized: false }
});

export default pool;
