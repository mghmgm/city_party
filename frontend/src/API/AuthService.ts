import axios from 'axios';
import { hostname } from '../config';

export default class AuthService {
  static async login (username: string, password: string) {
    const response = await axios.post(hostname +'/api/token/', {
      username,
      password,
    })

    if (response.data.access) {
      localStorage.setItem('auth_token', response.data.access);
    }

    
    return response.data;
  }
}
