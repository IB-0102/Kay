require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  await pool.query(`UPDATE products SET imageurl = null WHERE imageurl LIKE '/uploads/%'`);
  console.log('Fixed broken images');
  process.exit(0);
}
run();
