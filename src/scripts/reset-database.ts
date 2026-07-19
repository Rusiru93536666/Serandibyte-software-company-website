import { query, repairCorruptedContent } from '../app/lib/db';
import { DEFAULT_PAGE_CONTENT } from '../app/lib/defaultContent';

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // Delete all page content
    await query('DELETE FROM page_content');
    console.log('✅ Cleared existing page content');
    
    // Re-insert default content
    for (const [pageName, content] of Object.entries(DEFAULT_PAGE_CONTENT)) {
      const jsonString = JSON.stringify(content);
      await query(
        'INSERT INTO page_content (page_name, content_json) VALUES (?, ?)',
        [pageName, jsonString]
      );
      console.log(`✅ Seeded content for page: ${pageName}`);
    }
    
    console.log('✅ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
  }
}

// Run the reset
resetDatabase();