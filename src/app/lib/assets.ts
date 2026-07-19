export function resolveAssetPath(path?: string, fallback = '/circule.gif') {
  if (!path) return fallback;

  if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('/')) {
    return path;
  }

  return `/${path.replace(/^\.\//, '').replace(/^\//, '')}`;
}
