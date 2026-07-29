-- ============================================================
-- Seed data to replace hardcoded frontend content.
-- Run this once against your `serandibyteweb` database:
--   mysql -u root -p serandibyteweb < seed_content.sql
-- Safe to re-run: uses INSERT ... ON DUPLICATE KEY UPDATE.
-- ============================================================

-- ---------- 1. Home page content (hero, process, focus area, contact copy) ----------
INSERT INTO page_content (page_name, content_json)
VALUES (
  'home',
  JSON_OBJECT(
    'hero', JSON_OBJECT(
      'badge', 'SerandiByte Portfolio',
      'title', 'Welcome to\nSerandiByte',
      'description', 'SerandiByte is a cutting-edge platform designed to streamline your digital experience. Our mission is to provide top-notch services that enhance productivity and foster innovation.',
      'ctaText', 'Free Consultant'
    ),
    'marquee', JSON_OBJECT('text', 'SERANDIBYTE'),
    'servicesIntro', JSON_OBJECT(
      'heading', 'What you need to',
      'highlight', 'Grow Online',
      'description', 'We provide a complete range of digital solutions to help your business thrive in the modern world. From concept to launch, we work closely with you to deliver results that combine creativity, functionality, and performance.'
    ),
    'process', JSON_OBJECT(
      'heading', 'How We Take You From',
      'highlight', 'Idea to Impact',
      'description', 'We provide a complete range of digital solutions to help your business thrive in the modern world. From concept to launch, we work closely with you to deliver results that combine creativity, functionality, and performance.',
      'steps', JSON_ARRAY(
        JSON_OBJECT('number','01','title','Discovery & Consultation','subtitle','Understanding your business goals, audience, and requirements','body','Every successful project begins with understanding your business. We take the time to learn about your company, target audience, objectives, and the challenges you face.'),
        JSON_OBJECT('number','02','title','Strategy & Planning','subtitle','Creating a clear roadmap for successful project execution','body','Once we understand your requirements, we develop a clear strategy and project roadmap, planning features, technologies, design approach, and timeline.'),
        JSON_OBJECT('number','03','title','Design & Branding','subtitle','Building modern designs that strengthen your brand identity','body','Our creative team designs intuitive user experiences, modern interfaces, and compelling brand visuals that strengthen your business identity.'),
        JSON_OBJECT('number','04','title','Development','subtitle','Creating powerful digital solutions with modern technology','body','Using modern technologies and industry best practices, we transform ideas into powerful digital solutions built for performance, security, and scale.'),
        JSON_OBJECT('number','05','title','Content Creation','subtitle','Producing content that promotes and grows your brand','body','We create engaging promotional videos, eye-catching social media posts, and impactful digital marketing content to grow your brand visibility.'),
        JSON_OBJECT('number','06','title','Testing & Quality Assurance','subtitle','Ensuring quality, performance, and reliability','body','We conduct comprehensive testing across devices and platforms, resolving issues early to deliver a reliable, seamless experience.'),
        JSON_OBJECT('number','07','title','Launch & Deployment','subtitle','Delivering your solution smoothly to the market','body','We handle deployment with precision and monitor the launch to guarantee everything performs as expected from day one.'),
        JSON_OBJECT('number','08','title','Growth & Support','subtitle','Providing continuous improvements and long-term support','body','We provide ongoing maintenance, technical support, and performance optimization to help your business grow sustainably.')
      )
    ),
    'focusArea', JSON_OBJECT(
      'heading', 'Our Focus',
      'highlight', 'Areas',
      'description', 'We specialize in delivering cutting-edge solutions across diverse industries, transforming businesses with innovative technology.',
      'items', JSON_ARRAY(
        JSON_OBJECT('title','Startups','desc','Fueling innovation and rapid growth.','icon','Rocket'),
        JSON_OBJECT('title','E-Commerce & Retail','desc','Smart platforms for seamless shopping.','icon','ShoppingCart'),
        JSON_OBJECT('title','Healthcare','desc','Digital solutions improving patient care.','icon','Heart'),
        JSON_OBJECT('title','Education','desc','Modern tools for smarter learning.','icon','GraduationCap'),
        JSON_OBJECT('title','Agri Tech','desc','Technology transforming farming efficiency.','icon','Wheat'),
        JSON_OBJECT('title','Tourism','desc','Enhancing travel with digital experiences.','icon','Binoculars'),
        JSON_OBJECT('title','Transportation','desc','Smarter logistics and mobility systems.','icon','Bus'),
        JSON_OBJECT('title','Manufacturing','desc','Automation driving production efficiency.','icon','Factory')
      )
    ),
    'contact', JSON_OBJECT(
      'heading', 'Contact us',
      'description', 'We are always looking for ways to improve our products and services. Contact us and let us know how we can help you.'
    )
  )
)
ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = NOW();

-- ---------- 2. Site-wide settings (public, shown on Contact/Footer) ----------
INSERT INTO settings (setting_key, setting_value, setting_group, is_public) VALUES
  ('contact_website', 'Serandibyte.com', 'contact', true),
  ('contact_phone', '+94 76 612 48 47', 'contact', true),
  ('contact_email', 'Serandibyte@gmail.com', 'contact', true),
  ('footer_phone', '+94 (77) 584-1916', 'contact', true),
  ('footer_email', 'serandibyte.com', 'contact', true),
  ('footer_description', 'Innovative technology solutions for the modern world. Building tomorrow''s digital experiences today.', 'general', true),
  ('footer_copyright', '© 2025 SerandiByte. All rights reserved.', 'general', true),
  ('social_instagram', 'https://instagram.com/serandibyte', 'social', true),
  ('social_facebook', 'https://www.facebook.com/profile.php?id=61577339051986', 'social', true)
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();

-- ---------- 3. Services (was the hardcoded SERVICES array in Services.jsx) ----------
INSERT INTO services (title, description, icon, image, details, is_active, display_order) VALUES
  ('UI / UX Design', 'Futuristic interfaces, micro-interactions, and clarity. Design systems that scale.', 'Palette', '/test.png', 'We design intuitive user experiences, modern interfaces, and compelling visuals for E-commerce, POS systems, and automation platforms.', true, 1),
  ('Web Development', 'Next.js, edge-ready, SEO-aware. Fast by default, beautiful by design.', 'Code', '/test.png', 'We build fast, secure, and scalable websites using modern frameworks tailored to your business needs.', true, 2),
  ('Software Dev', 'Custom platforms: web, mobile, and cloud. Reliable. Observable. Maintainable.', 'Cpu', '/test.png', 'Custom business software, POS systems, and cloud platforms built for performance and long-term maintainability.', true, 3)
ON DUPLICATE KEY UPDATE description = VALUES(description);
