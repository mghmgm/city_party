import axios from 'axios';
import { hostname } from '../config';
import { IPlace } from './types';

export default class PlaceService {
  static async getAll(limit: number): Promise<IPlace[] | null> {
    const response = await axios.get<IPlace[]>(hostname + '/api/places', {
      params: {
        _limit: limit,
      },
    });
    return response.data;
  }
}
