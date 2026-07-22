require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
async function run() {
  await pool.query(`UPDATE products SET imageurl = '/assets/images/luxury_shoes_display_1784626142784.jpg' WHERE name = 'Elegant Stilettos'`);
  await pool.query(`UPDATE products SET imageurl = '/assets/images/luxury_bags_display_1784626156957.jpg' WHERE name = 'Classic Leather Handbag'`);
  console.log('Updated');
  process.exit(0);
}
run();
