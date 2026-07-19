import mysql from 'mysql2/promise';
import { DEFAULT_PAGE_CONTENT } from './defaultContent';

let pool: mysql.Pool | null = null;
let initialized = false;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'serandibyteweb',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query(sql: string, params: any[] = []): Promise<any[]> {
  const conn = await getConnection();
  const [rows] = await conn.execute(sql, params);
  return rows as any[];
}

async function initializeDatabase() {
  if (initialized) return;

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS page_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL UNIQUE,
        content_json JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists, if not create one
    const adminCheck = await query('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    if (adminCheck.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Admin user created: admin / admin123');
    }

    // Seed default content
    const existingPages = await query('SELECT page_name FROM page_content');
    const existingNames = new Set(existingPages.map((row: any) => row.page_name));

    for (const [pageName, content] of Object.entries(DEFAULT_PAGE_CONTENT)) {
      if (!existingNames.has(pageName)) {
        const jsonString = JSON.stringify(content);
        await query('INSERT INTO page_content (page_name, content_json) VALUES (?, ?)', [pageName, jsonString]);
        console.log(`Seeded default content for page: ${pageName}`);
      }
    }

    initialized = true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function ensurePageContentSeeded(pageName: string, content: any) {
  await initializeDatabase();
  try {
    const existing = await query('SELECT id FROM page_content WHERE page_name = ?', [pageName]);
    if (existing.length === 0) {
      const jsonString = JSON.stringify(content);
      await query('INSERT INTO page_content (page_name, content_json) VALUES (?, ?)', [pageName, jsonString]);
    }
  } catch (error) {
    console.error('Failed to seed page content:', error);
  }
}

export async function getPageContent(pageName: string) {
  try {
    await initializeDatabase();
    const rows = await query(
      'SELECT content_json FROM page_content WHERE page_name = ?',
      [pageName]
    );
    
    if (rows && rows.length > 0 && rows[0]) {
      const contentJson = rows[0].content_json;
      
      // Handle different possible formats
      if (typeof contentJson === 'string') {
        try {
          return JSON.parse(contentJson);
        } catch (parseError) {
          console.error(`Failed to parse JSON for page ${pageName}:`, parseError);
          // If parsing fails, return default content
          const defaultContent = DEFAULT_PAGE_CONTENT[pageName];
          if (defaultContent) {
            // Update the database with properly formatted JSON
            await updatePageContent(pageName, defaultContent);
            return defaultContent;
          }
          return {};
        }
      } else if (typeof contentJson === 'object' && contentJson !== null) {
        // If it's already an object, return it
        return contentJson;
      }
      
      return {};
    }
    return null;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}

export async function updatePageContent(pageName: string, content: any) {
  try {
    await initializeDatabase();
    const jsonString = JSON.stringify(content);
    const result = await query(
      'INSERT INTO page_content (page_name, content_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)',
      [pageName, jsonString]
    );
    return result;
  } catch (error) {
    console.error('Error updating page content:', error);
    throw error;
  }
}

export async function getAdminUser(username: string) {
  try {
    await initializeDatabase();
    const rows = await query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );
    if (rows && rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}

// Utility function to repair corrupted JSON data
export async function repairCorruptedContent() {
  try {
    await initializeDatabase();
    const allPages = await query('SELECT page_name, content_json FROM page_content');
    
    for (const row of allPages) {
      const pageName = row.page_name;
      const content = row.content_json;
      
      // Check if content is valid JSON
      let isValid = false;
      try {
        if (typeof content === 'string') {
          JSON.parse(content);
          isValid = true;
        } else if (typeof content === 'object') {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
      
      if (!isValid) {
        console.log(`Repairing corrupted content for page: ${pageName}`);
        const defaultContent = DEFAULT_PAGE_CONTENT[pageName];
        if (defaultContent) {
          await updatePageContent(pageName, defaultContent);
          console.log(`Repaired content for page: ${pageName}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to repair corrupted content:', error);
  }
}

// Run repair on startup
repairCorruptedContent().catch(console.error);