import axios from 'axios';
import { hostname } from '../config';
import { IBanner } from './types';

export class BannerService {
  static async getAll(): Promise<IBanner[] | null> {
    const response = await axios.get<IBanner[]>(hostname + '/api/banners');
    return response.data;
  }
}
