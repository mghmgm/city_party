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

  static async getComments(id: number) {
    const response = await axios.get(hostname + `/api/events/${id}/reviews/`)
    return response
  }

  static async postComment(id: number, data: {description: string, rating: string}) {
    const token = localStorage.getItem('auth_token')
    const response = await axios.post(hostname + `/api/events/${id}/reviews/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response
  }
}
