import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MySQL Connection Pool
let pool = null;

const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'serandibyteweb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

// ============================================
// ALL DATABASE QUERIES - Server Functions
// ============================================

// --- AUTH QUERIES ---
export const findUserByUsername = async (username) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM admin_users WHERE username = ?',
    [username]
  );
  return rows[0];
};

export const updateUserLastLogin = async (userId) => {
  const connection = await getConnection();
  await connection.execute(
    'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
    [userId]
  );
};

export const verifyUserById = async (userId) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT id, username, email, role, is_active FROM admin_users WHERE id = ?',
    [userId]
  );
  return rows[0];
};

// --- PAGE CONTENT QUERIES ---
export const getAllPages = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT id, page_name, updated_at FROM page_content ORDER BY page_name'
  );
  return rows;
};

export const getPageContent = async (pageName) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM page_content WHERE page_name = ?',
    [pageName]
  );
  return rows[0];
};

export const savePageContent = async (pageName, contentJson) => {
  const connection = await getConnection();
  const contentString = typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson);
  
  const [result] = await connection.execute(
    `INSERT INTO page_content (page_name, content_json) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE content_json = ?, updated_at = NOW()`,
    [pageName, contentString, contentString]
  );
  return result;
};

// --- SERVICES QUERIES ---
export const getAllServices = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM services ORDER BY display_order ASC'
  );
  return rows;
};

export const getActiveServices = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM services WHERE is_active = true ORDER BY display_order ASC'
  );
  return rows;
};

export const createService = async (serviceData) => {
  const { title, description, icon, image, details, is_active, display_order } = serviceData;
  const connection = await getConnection();
  
  const [result] = await connection.execute(
    `INSERT INTO services (title, description, icon, image, details, is_active, display_order) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, icon, image, details, is_active || true, display_order || 0]
  );
  
  const [rows] = await connection.execute(
    'SELECT * FROM services WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
};

export const updateService = async (id, serviceData) => {
  const { title, description, icon, image, details, is_active, display_order } = serviceData;
  const connection = await getConnection();
  
  await connection.execute(
    `UPDATE services 
     SET title = ?, description = ?, icon = ?, image = ?, details = ?, 
         is_active = ?, display_order = ?, updated_at = NOW()
     WHERE id = ?`,
    [title, description, icon, image, details, is_active, display_order, id]
  );
  
  const [rows] = await connection.execute(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const deleteService = async (id) => {
  const connection = await getConnection();
  const [result] = await connection.execute(
    'DELETE FROM services WHERE id = ?',
    [id]
  );
  return result;
};

// --- CONTACT MESSAGES QUERIES ---
export const saveContactMessage = async (data) => {
  const { service, email, phone, company, message, ip, userAgent } = data;
  const connection = await getConnection();
  
  const [result] = await connection.execute(
    `INSERT INTO contact_messages (service, email, phone, company, message, ip_address, user_agent, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [service, email, phone, company, message, ip, userAgent]
  );
  return result.insertId;
};

export const getContactMessages = async (status, limit, offset) => {
  const connection = await getConnection();
  let sql = 'SELECT * FROM contact_messages';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const [rows] = await connection.execute(sql, params);
  return rows;
};

export const countContactMessages = async (status) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    status ? 'SELECT COUNT(*) as total FROM contact_messages WHERE status = ?' 
           : 'SELECT COUNT(*) as total FROM contact_messages',
    status ? [status] : []
  );
  return rows[0].total;
};

export const updateMessageStatus = async (id, status) => {
  const connection = await getConnection();
  const [result] = await connection.execute(
    'UPDATE contact_messages SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, id]
  );
  return result;
};

// --- SETTINGS QUERIES ---
export const getSettings = async (group) => {
  const connection = await getConnection();
  let sql = 'SELECT * FROM settings';
  const params = [];

  if (group) {
    sql += ' WHERE setting_group = ?';
    params.push(group);
  }

  const [rows] = await connection.execute(sql, params);
  return rows;
};

export const getPublicSettings = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM settings WHERE is_public = true'
  );
  return rows;
};

export const updateSettings = async (settings, group) => {
  const connection = await getConnection();
  
  for (const [key, value] of Object.entries(settings)) {
    await connection.execute(
      `INSERT INTO settings (setting_key, setting_value, setting_group) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()`,
      [key, value, group || 'general', value]
    );
  }
};

// ============================================
// AUTH MIDDLEWARE
// ============================================
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    await getConnection();
    console.log('MySQL connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

startServer();

// Import routes AFTER server is set up
// This avoids circular dependencies
import('./routes/adminRoutes.js').then(module => {
  app.use('/api/admin', module.default);
});

import('./routes/contentRoutes.js').then(module => {
  app.use('/api/content', module.default);
});

// Legacy contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { service, email, phone, company, message } = req.body;

    if (!service || !email || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.socket.remoteAddress || 
               '127.0.0.1';

    const userAgent = req.headers['user-agent'] || '';

    const id = await saveContactMessage({
      service, email, phone, company, message, ip, userAgent
    });

    res.status(200).json({ 
      message: 'Message saved successfully!',
      id 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});