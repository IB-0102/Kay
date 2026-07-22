require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const { rows } = await pool.query('SELECT * FROM settings');
  console.log(rows);
  process.exit(0);
}
run();
