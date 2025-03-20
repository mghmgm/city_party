import axios from 'axios';
import { hostname } from '../config';

export default class EventService {
  static async getAll(limit: number) {
    const response = await axios.get(hostname + '/api/places', {
      params: {
        _limit: limit,
      },
    });
    return response;
  }
}
