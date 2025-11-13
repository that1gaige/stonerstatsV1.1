export const LOCALBACKEND_CONFIG = {
  // Change this to your computer's IP address when testing on mobile
  // Run 'ipconfig' in Command Prompt to find your IPv4 Address
  // Example: 'http://192.168.1.100:4000'
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
