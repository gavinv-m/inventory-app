import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.LOCAL_DB_URL,
  ssl: false,
});

export default client;
