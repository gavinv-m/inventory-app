import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const inProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: inProduction
    ? process.env.DATABASE_URL
    : process.env.LOCAL_DB_URL + '/my_movie_db',
  ssl: inProduction ? { rejectUnauthorized: false } : false,
});

export default pool;
