import axios, { AxiosResponse } from 'axios';
import { hostname } from '../config';
import { IBanner } from './types';

export class BannerService {
  static async getAll() {
    const response = await axios.get(hostname + '/api/banners');
    return response;
  }
}
