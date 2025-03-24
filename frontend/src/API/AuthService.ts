import axios from 'axios';
import { hostname } from '../config';
import { IUserProfile } from './types';

export default class AuthService {
  static async login(username: string, password: string) {
    const response = await axios.post(`${hostname}/api/token/`, {
      username,
      password,
    });
    if (response.data.access && response.data.refresh) {
      AuthService.saveTokens(response.data.access, response.data.refresh, response.data.expires_in);
    }
    return response.data;
  }

  static saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('auth_token_exp', expirationTime.toString());
  }

  static isAccessTokenExpired() {
    const exp = localStorage.getItem('auth_token_exp');
    return exp ? Date.now() > parseInt(exp) : true;
  }

  static async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${hostname}/api/token/refresh/`, {
        refresh: refreshToken,
      });

      if (response.data.access) {
        AuthService.saveTokens(response.data.access, refreshToken, response.data.expires_in);
        return response.data.access;
      }
    } catch (error) {
      AuthService.logout();
      return null;
    }
  }

  static async getCurrentUser(): Promise<IUserProfile | null> {
    let token = localStorage.getItem('auth_token');

    if (!token || AuthService.isAccessTokenExpired()) {
      token = await AuthService.refreshAccessToken();
      if (!token) return null;
    }

    try {
      const response = await axios.get<IUserProfile>(`${hostname}/api/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token_exp');
  }
}
