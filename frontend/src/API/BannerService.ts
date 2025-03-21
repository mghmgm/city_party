import axios from 'axios';
import { hostname } from '../config';

export class BannerService {
  static async getAll() {
    const response = await axios.get(hostname + '/api/banners');
    return response;
  }
}
