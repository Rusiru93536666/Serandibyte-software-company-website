import { getPageContent, updatePageContent, ensurePageContentSeeded } from './db';
import { DEFAULT_PAGE_CONTENT } from './defaultContent';

export async function getContent(pageName: string) {
  const content = await getPageContent(pageName);
  if (!content) {
    const defaults = getDefaultContent(pageName);
    await ensurePageContentSeeded(pageName, defaults);
    return defaults;
  }
  return content;
}

export async function updateContent(pageName: string, content: any) {
  return await updatePageContent(pageName, content);
}

export function getDefaultContent(pageName: string) {
  return DEFAULT_PAGE_CONTENT[pageName] || {};
}