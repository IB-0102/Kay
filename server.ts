import express from 'express';
import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-development-only';

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize PostgreSQL Pool
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl && !dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
  dbUrl = 'postgresql://' + dbUrl;
}

const pool = new Pool({
  connectionString: dbUrl,
});

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API ROUTES

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin change password
app.post('/api/auth/change-password', authenticateToken, async (req: any, res: any) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: 'New password is required' });
    const hash = bcrypt.hashSync(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  try {
    const { rows: products } = await pool.query('SELECT * FROM products ORDER BY id DESC');
    // Convert boolean ints to real booleans for frontend
    const formatted = products.map((p: any) => ({
      ...p,
      imageUrl: p.imageurl ?? p.imageUrl,
      isAvailable: Number(p.isavailable ?? p.isAvailable) === 1,
      isFeatured: Number(p.isfeatured ?? p.isFeatured) === 1
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message, stack: err.stack, db_url: process.env.DATABASE_URL });
  }
});

app.post('/api/products', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  try {
    const { name, category, price, description, isAvailable, isFeatured } = req.body;
    let imageUrl = null;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const result = await pool.query(`
      INSERT INTO products (name, category, price, description, imageUrl, isAvailable, isFeatured) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      name, category, parseFloat(price), description, imageUrl, 
      isAvailable === 'true' ? 1 : 0, 
      isFeatured === 'true' ? 1 : 0
    ]);

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, isAvailable, isFeatured } = req.body;
    
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    const product = rows[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let imageUrl = product.imageurl || product.imageUrl;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    await pool.query(`
      UPDATE products SET name = $1, category = $2, price = $3, description = $4, imageUrl = $5, isAvailable = $6, isFeatured = $7
      WHERE id = $8
    `, [
      name, category, parseFloat(price), description, imageUrl,
      isAvailable === 'true' || isAvailable === true ? 1 : 0, 
      isFeatured === 'true' || isFeatured === true ? 1 : 0,
      id
    ]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Stats ---
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalProducts = await pool.query('SELECT COUNT(*) as count FROM products');
    const totalShoes = await pool.query('SELECT COUNT(*) as count FROM products WHERE category = $1', ['Shoes']);
    const totalBags = await pool.query('SELECT COUNT(*) as count FROM products WHERE category = $1', ['Bags']);
    const totalClothes = await pool.query('SELECT COUNT(*) as count FROM products WHERE category = $1', ['Clothes']);
    
    res.json({
      totalProducts: parseInt(totalProducts.rows[0].count),
      totalShoes: parseInt(totalShoes.rows[0].count),
      totalBags: parseInt(totalBags.rows[0].count),
      totalClothes: parseInt(totalClothes.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Content Settings ---
app.get('/api/content', async (req, res) => {
  try {
    const { rows: settings } = await pool.query('SELECT * FROM settings');
    const content = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as any);
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/content', authenticateToken, async (req, res) => {
  try {
    const { about_us, vision, privacy_policy, terms_conditions } = req.body;
    
    if (about_us !== undefined) await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [about_us, 'about_us']);
    if (vision !== undefined) await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [vision, 'vision']);
    if (privacy_policy !== undefined) await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [privacy_policy, 'privacy_policy']);
    if (terms_conditions !== undefined) await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [terms_conditions, 'terms_conditions']);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vite Development server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0" as any, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

