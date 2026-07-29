import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByUsername,
  updateUserLastLogin,
  verifyUserById,
  getAllPages,
  getPageContent,
  savePageContent,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getContactMessages,
  countContactMessages,
  updateMessageStatus,
  getSettings,
  updateSettings,
  authenticateToken
} from '../server.js';

const router = express.Router();

// ============ AUTH ROUTES ============

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await updateUserLastLogin(user.id);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await verifyUserById(req.user.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ PAGE CONTENT ROUTES ============

router.get('/pages', authenticateToken, async (req, res) => {
  try {
    const pages = await getAllPages();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pages/:pageName', authenticateToken, async (req, res) => {
  try {
    const page = await getPageContent(req.params.pageName);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/pages/:pageName', authenticateToken, async (req, res) => {
  try {
    const { content_json } = req.body;

    if (!content_json) {
      return res.status(400).json({ message: 'Content is required' });
    }

    await savePageContent(req.params.pageName, content_json);

    res.json({ 
      message: 'Page saved successfully',
      page_name: req.params.pageName
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ SERVICES ROUTES ============

router.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/services', authenticateToken, async (req, res) => {
  try {
    const service = await createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/services/:id', authenticateToken, async (req, res) => {
  try {
    const service = await updateService(req.params.id, req.body);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/services/:id', authenticateToken, async (req, res) => {
  try {
    const result = await deleteService(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ CONTACT MESSAGES ROUTES ============

router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const messages = await getContactMessages(status, limit, offset);
    const total = await countContactMessages(status);

    res.json({
      messages,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/messages/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const result = await updateMessageStatus(req.params.id, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Status updated successfully', status });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ SETTINGS ROUTES ============

router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const { group } = req.query;
    const settings = await getSettings(group);
    
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.setting_key] = s.setting_value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { settings } = req.body;
    const { group = 'general' } = req.query;

    await updateSettings(settings, group);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;