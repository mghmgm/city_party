import axios from 'axios';
import { hostname } from '../config';
import { ICategory } from './types';

export class CategoryService {
  static async getAll(): Promise<ICategory[] | null> {
    const response = await axios.get<ICategory[]>(hostname + '/api/categories');
    return response.data;
  }
}
