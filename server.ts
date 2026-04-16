import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-dmart-daska';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // For base64 images

  // Initialize SQLite Database
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      unit TEXT NOT NULL,
      stock INTEGER NOT NULL,
      image TEXT,
      visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerAddress TEXT NOT NULL,
      items TEXT NOT NULL, -- JSON string
      total INTEGER NOT NULL,
      paymentMethod TEXT NOT NULL,
      paymentScreenshot TEXT,
      status TEXT DEFAULT 'New',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    );
  `);

  // Seed Admin
  const adminExists = await db.get('SELECT * FROM admin WHERE email = ?', ['admin@dmartdaska.com']);
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO admin (email, passwordHash) VALUES (?, ?)', ['admin@dmartdaska.com', hash]);
  }

  // Seed Categories if empty
  const catCount = await db.get('SELECT COUNT(*) as count FROM categories');
  if (catCount.count === 0) {
    const initialCategories = [
      { name: 'Vegetables', icon: 'Carrot' },
      { name: 'Fruits', icon: 'Apple' },
      { name: 'Dairy', icon: 'Milk' },
      { name: 'Beverages', icon: 'Coffee' },
      { name: 'Snacks', icon: 'Cookie' },
      { name: 'Cleaning', icon: 'Sparkles' },
      { name: 'Bakery', icon: 'Croissant' },
      { name: 'Frozen', icon: 'Snowflake' }
    ];
    for (const cat of initialCategories) {
      await db.run('INSERT INTO categories (name, icon) VALUES (?, ?)', [cat.name, cat.icon]);
    }
  }

  // Seed Products if empty
  const prodCount = await db.get('SELECT COUNT(*) as count FROM products');
  if (prodCount.count === 0) {
    const initialProducts = [
      { name: 'Fresh Tomatoes', category: 'Vegetables', price: 150, unit: 'per kg', stock: 50, image: 'https://picsum.photos/seed/tomato/400/400', visible: 1 },
      { name: 'Onions', category: 'Vegetables', price: 120, unit: 'per kg', stock: 100, image: 'https://picsum.photos/seed/onion/400/400', visible: 1 },
      { name: 'Apples (Kala Kulu)', category: 'Fruits', price: 300, unit: 'per kg', stock: 30, image: 'https://picsum.photos/seed/apple/400/400', visible: 1 },
      { name: 'Milk (Nestle Milkpak)', category: 'Dairy', price: 280, unit: '1 Liter', stock: 20, image: 'https://picsum.photos/seed/milk/400/400', visible: 1 },
      { name: 'Lays French Cheese', category: 'Snacks', price: 100, unit: 'per pack', stock: 50, image: 'https://picsum.photos/seed/lays/400/400', visible: 1 },
      { name: 'Coca Cola', category: 'Beverages', price: 150, unit: '1.5 Liter', stock: 40, image: 'https://picsum.photos/seed/coke/400/400', visible: 1 },
    ];
    for (const p of initialProducts) {
      await db.run('INSERT INTO products (name, category, price, unit, stock, image, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [p.name, p.category, p.price, p.unit, p.stock, p.image, p.visible]);
    }
  }

  // Auth Middleware
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

  // --- API Routes ---

  // Admin Login
  app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await db.get('SELECT * FROM admin WHERE email = ?', [email]);
    if (admin && await bcrypt.compare(password, admin.passwordHash)) {
      const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Public Products
  app.get('/api/products', async (req, res) => {
    const products = await db.all('SELECT * FROM products WHERE visible = 1');
    res.json(products);
  });

  app.get('/api/products/:id', async (req, res) => {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Not found' });
  });

  // Public Categories
  app.get('/api/categories', async (req, res) => {
    const categories = await db.all('SELECT * FROM categories');
    res.json(categories);
  });

  // Place Order
  app.post('/api/orders', async (req, res) => {
    const { customerName, customerPhone, customerAddress, items, total, paymentMethod, paymentScreenshot } = req.body;
    
    let status = 'New';
    if (paymentMethod !== 'Cash on Delivery') {
      status = 'Pending Payment Verification';
    }

    const result = await db.run(
      'INSERT INTO orders (customerName, customerPhone, customerAddress, items, total, paymentMethod, paymentScreenshot, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customerName, customerPhone, customerAddress, JSON.stringify(items), total, paymentMethod, paymentScreenshot, status]
    );
    
    res.json({ orderId: result.lastID, status });
  });

  // Admin Routes
  app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
    const orders = await db.all('SELECT * FROM orders ORDER BY createdAt DESC');
    res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
  });

  app.put('/api/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
    const { status } = req.body;
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  });

  app.get('/api/admin/products', authenticateAdmin, async (req, res) => {
    const products = await db.all('SELECT * FROM products');
    res.json(products);
  });

  app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
    const { name, category, price, unit, stock, image, visible } = req.body;
    const result = await db.run(
      'INSERT INTO products (name, category, price, unit, stock, image, visible) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, price, unit, stock, image, visible ? 1 : 0]
    );
    res.json({ id: result.lastID });
  });

  app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
    const { name, category, price, unit, stock, image, visible } = req.body;
    await db.run(
      'UPDATE products SET name = ?, category = ?, price = ?, unit = ?, stock = ?, image = ?, visible = ? WHERE id = ?',
      [name, category, price, unit, stock, image, visible ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  });

  app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  });

  app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const totalOrdersToday = await db.get('SELECT COUNT(*) as count FROM orders WHERE date(createdAt) = ?', [today]);
    const pendingOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status IN ("New", "Pending Payment Verification")');
    const deliveredOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status = "Delivered"');
    const totalRevenue = await db.get('SELECT SUM(total) as sum FROM orders WHERE status != "Cancelled"');

    res.json({
      totalOrdersToday: totalOrdersToday.count,
      pendingOrders: pendingOrders.count,
      deliveredOrders: deliveredOrders.count,
      totalRevenue: totalRevenue.sum || 0
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
