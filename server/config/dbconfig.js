import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DB_PSQL;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

export default pool;
