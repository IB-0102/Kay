import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT * FROM products ORDER BY id DESC')
  .then(res => console.log(res.rows))
  .catch(err => console.error(err));
