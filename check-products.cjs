require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  try {
    const { rows } = await pool.query('SELECT id, name, imageurl FROM products');
    console.log(rows);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
