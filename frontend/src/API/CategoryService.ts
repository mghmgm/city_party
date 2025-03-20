import axios from 'axios';
import { hostname } from '../config';

export class CategoryService {
  static async getAll() {
    const response = await axios.get(hostname + '/api/categories');
    return response;
  }
}
