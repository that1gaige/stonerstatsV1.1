export interface ServerOption {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'PC',
    name: 'Local Server',
    url: 'http://192.168.0.100:4000',
    description: 'Your computer IP on WiFi'
  },
    {
    id: 'Laptop',
    name: 'Local Server',
    url: 'http://192.168.0.100:4000',
    description: 'Your laptop IP on WiFi'
  },
  {
    id: 'localhost',
    name: 'Localhost',
    url: 'http://localhost:4000',
    description: 'For simulators only'
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
