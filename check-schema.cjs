require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const { rows } = await pool.query(`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name IN ('imageurl', 'imageUrl');
  `);
  console.log(rows);
  process.exit(0);
}
run();
