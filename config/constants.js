export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const SERVICE_TYPES = ['Website', 'Software', 'Design'];
export const STATUS_TYPES = ['pending', 'read', 'replied'];

export const SECTIONS = {
  HERO: 'hero',
  ABOUT: 'about',
  SERVICES: 'services',
  CONTACT: 'contact',
  FOOTER: 'footer',
};

export const ICON_MAP = {
  Layers: 'Layers',
  ChartNoAxesCombined: 'ChartNoAxesCombined',
  Rocket: 'Rocket',
  PenTool: 'PenTool',
  Code: 'Code',
  Server: 'Server',
  ShoppingCart: 'ShoppingCart',
  Heart: 'Heart',
  GraduationCap: 'GraduationCap',
  Wheat: 'Wheat',
  Binoculars: 'Binoculars',
  Bus: 'Bus',
  Factory: 'Factory',
};

export const CACHE_KEYS = {
  ALL_CONTENT: 'content:all',
  SECTION_CONTENT: 'content:section:',
  SERVICES: 'services:all',
  FEATURES: 'features:all',
  CATEGORIES: 'categories:all',
};

export default {
  HTTP_STATUS,
  MESSAGE_TYPES,
  ROLES,
  SERVICE_TYPES,
  STATUS_TYPES,
  SECTIONS,
  ICON_MAP,
  CACHE_KEYS,
};
