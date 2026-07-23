require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  try {
    const { rows } = await pool.query('SELECT * FROM settings');
    console.log("Settings:", rows);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
