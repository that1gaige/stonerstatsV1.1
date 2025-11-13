export const LOCALBACKEND_CONFIG = {
  BASE_URL: 'http://localhost:4000',
  API_ENDPOINTS: {
    HEALTH: '/api/health',
    AUTH: {
      SIGNUP: '/api/auth/signup',
      LOGIN: '/api/auth/login',
      ME: '/api/auth/me',
    },
    STRAINS: '/api/strains',
    SESSIONS: '/api/sessions',
  },
  TIMEOUT: 10000,
};

export function getLocalBackendUrl() {
  return LOCALBACKEND_CONFIG.BASE_URL;
}

export function setLocalBackendUrl(url: string) {
  LOCALBACKEND_CONFIG.BASE_URL = url;
}
