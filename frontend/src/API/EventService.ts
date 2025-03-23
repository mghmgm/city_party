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

  static async getGallery(id: number, limit: number) {
    const response = await axios.get(hostname + `/api/events/${id}/gallery/`, {
      params: {
        _limit: limit,
      }
    })
    return response
  }

  static async getTicketTypes(id: number) {
    const response = await axios.get(hostname + `/api/events/${id}/ticket-types/`)
    return response
  }
}
