import axios from 'axios';
import { hostname } from '../config';

export default class EventService {
  static async getAll(limit: number) {
    const response = await axios.get(hostname + '/api/events', {
      params: {
        _limit: limit,
      },
    });
    return response;
  }

  static async getById(id: number) {
    const response = await axios.get(hostname + `/api/events/${id}`);
    return response;
  }
}
