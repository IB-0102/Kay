require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const hash = bcrypt.hashSync('GREATVALUE222', 10);
  await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hash, 'admin']);
  console.log('Password reset');
  process.exit(0);
}
run();
