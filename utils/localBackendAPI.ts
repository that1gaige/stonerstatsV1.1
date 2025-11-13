import { LOCALBACKEND_CONFIG } from '@/constants/localBackendConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'localbackend_auth_token';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Strain {
  id: string;
  name: string;
  type?: string;
  thc?: number;
  cbd?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  strainId?: string;
  strainName: string;
  rating?: number;
  notes?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

class LocalBackendAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = LOCALBACKEND_CONFIG.BASE_URL;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token && !endpoint.includes('/auth/signup') && !endpoint.includes('/auth/login')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`[LocalBackend] ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: LOCALBACKEND_CONFIG.TIMEOUT,
      } as any);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[LocalBackend] Request failed:`, error);
      throw error;
    }
  }

  async healthCheck() {
    return this.request<{ status: string; service: string; version: string }>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.HEALTH
    );
  }

  async signup(email: string, username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.AUTH.SIGNUP,
      {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      }
    );

    if (response.token) {
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.token) {
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
    }

    return response;
  }

  async logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.AUTH.ME
    );
  }

  async getStrains(): Promise<Strain[]> {
    return this.request<Strain[]>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.STRAINS
    );
  }

  async getStrain(id: string): Promise<Strain> {
    return this.request<Strain>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.STRAINS}/${id}`
    );
  }

  async createStrain(strain: Omit<Strain, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strain> {
    return this.request<Strain>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.STRAINS,
      {
        method: 'POST',
        body: JSON.stringify(strain),
      }
    );
  }

  async updateStrain(id: string, strain: Partial<Strain>): Promise<Strain> {
    return this.request<Strain>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.STRAINS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(strain),
      }
    );
  }

  async deleteStrain(id: string): Promise<{ message: string; strain: Strain }> {
    return this.request<{ message: string; strain: Strain }>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.STRAINS}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  async getSessions(params?: { userId?: string; limit?: number }): Promise<Session[]> {
    let url = LOCALBACKEND_CONFIG.API_ENDPOINTS.SESSIONS;
    
    if (params) {
      const query = new URLSearchParams();
      if (params.userId) query.append('userId', params.userId);
      if (params.limit) query.append('limit', params.limit.toString());
      
      if (query.toString()) {
        url += `?${query.toString()}`;
      }
    }

    return this.request<Session[]>(url);
  }

  async getSession(id: string): Promise<Session> {
    return this.request<Session>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.SESSIONS}/${id}`
    );
  }

  async createSession(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    return this.request<Session>(
      LOCALBACKEND_CONFIG.API_ENDPOINTS.SESSIONS,
      {
        method: 'POST',
        body: JSON.stringify(session),
      }
    );
  }

  async updateSession(id: string, session: Partial<Session>): Promise<Session> {
    return this.request<Session>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.SESSIONS}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(session),
      }
    );
  }

  async deleteSession(id: string): Promise<{ message: string; session: Session }> {
    return this.request<{ message: string; session: Session }>(
      `${LOCALBACKEND_CONFIG.API_ENDPOINTS.SESSIONS}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }
}

export const localBackendAPI = new LocalBackendAPI();
