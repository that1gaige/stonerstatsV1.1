export interface ServerOption {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'local',
    name: 'Local Server',
    url: 'http://192.168.1.100:3001',
    description: 'Your computer IP'
  },
  {
    id: 'localhost',
    name: 'Localhost',
    url: 'http://localhost:3001',
    description: 'Testing only'
  }
];

let currentBackendUrl = SERVER_OPTIONS[0].url;

export const setLocalBackendUrl = (url: string) => {
  currentBackendUrl = url;
  console.log('[LocalBackendConfig] Backend URL changed to:', url);
};

export const LOCALBACKEND_CONFIG = {
  get BASE_URL() {
    return currentBackendUrl;
  }
};
