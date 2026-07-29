// import express from 'express';
// import {
//   getPageContent,
//   getActiveServices,
//   getPublicSettings
// } from '../server.js';

// const router = express.Router();

// // Get public page content
// router.get('/pages/:pageName', async (req, res) => {
//   try {
//     const page = await getPageContent(req.params.pageName);
    
//     if (!page) {
//       return res.status(404).json({ message: 'Page not found' });
//     }

//     res.json(page);
//   } catch (error) {
//     console.error('Error fetching page:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all public settings
// router.get('/settings', async (req, res) => {
//   try {
//     const settings = await getPublicSettings();
    
//     const settingsObj = {};
//     settings.forEach(s => {
//       settingsObj[s.setting_key] = s.setting_value;
//     });
//     res.json(settingsObj);
//   } catch (error) {
//     console.error('Error fetching settings:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all active services
// router.get('/services', async (req, res) => {
//   try {
//     const services = await getActiveServices();
//     res.json(services);
//   } catch (error) {
//     console.error('Error fetching services:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;



import express from 'express';
import {
  getPageContent,
  getActiveServices,
  getPublicSettings
} from '../server.js';

const router = express.Router();

// Helper: content_json can come back as a JS object (mysql2 auto-parses JSON
// columns) or as a string depending on driver/version, so normalize it.
const parseContentJson = (page) => {
  if (!page) return null;
  if (typeof page.content_json === 'string') {
    try {
      return JSON.parse(page.content_json);
    } catch {
      return null;
    }
  }
  return page.content_json;
};

const settingsRowsToObject = (rows) => {
  const obj = {};
  rows.forEach((s) => {
    obj[s.setting_key] = s.setting_value;
  });
  return obj;
};

// Aggregate endpoint used by the public homepage: one call instead of three.
router.get('/home', async (req, res) => {
  try {
    const [page, services, settingsRows] = await Promise.all([
      getPageContent('home'),
      getActiveServices(),
      getPublicSettings()
    ]);

    res.json({
      content: parseContentJson(page),
      services,
      settings: settingsRowsToObject(settingsRows)
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public page content for any page (kept for other pages besides home)
router.get('/pages/:pageName', async (req, res) => {
  try {
    const page = await getPageContent(req.params.pageName);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ ...page, content_json: parseContentJson(page) });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all public settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await getPublicSettings();
    res.json(settingsRowsToObject(settings));
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active services
router.get('/services', async (req, res) => {
  try {
    const services = await getActiveServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
