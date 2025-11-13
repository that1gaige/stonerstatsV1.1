export interface ServerOption {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'new-local',
    name: 'Local Server (New)',
    url: 'http://192.168.10.226:4000',
    description: 'Latest server instance',
  },
  {
    id: 'prev-local',
    name: 'Local Server (Previous)',
    url: 'http://172.20.10.3:4000',
    description: 'Previous server instance',
  },
  {
    id: 'rork-backend',
    name: 'Rork Backend (Offline)',
    url: process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.rork.app',
    description: 'Rork-hosted backend',
  },
];

export const LOCALBACKEND_CONFIG = {
  BASE_URL: SERVER_OPTIONS[0].url,
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
