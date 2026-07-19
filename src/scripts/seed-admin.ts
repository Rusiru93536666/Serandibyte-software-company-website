import { query } from '../app/lib/db';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    // Check if admin user exists
    const existing = await query('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    
    if (existing.length === 0) {
      // Create admin user
      const passwordHash = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', passwordHash]
      );
      console.log('✅ Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
  }
}

seedAdmin();