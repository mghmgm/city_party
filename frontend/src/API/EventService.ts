import axios from 'axios';
import { hostname } from '../config';
import { IEvent, IGallery, IReview, ITicketType } from './types';

export default class EventService {
  static async getAll(limit: number): Promise<IEvent[] | null> {
    const response = await axios.get<IEvent[]>(hostname + '/api/events', {
      params: {
        _limit: limit,
      },
    });
    return response.data;
  }

  static async getById(id: number): Promise<IEvent | null>  {
    const response = await axios.get<IEvent>(hostname + `/api/events/${id}`);
    return response.data;
  }

  static async getGallery(id: number, limit: number): Promise<IGallery | null> {
    const response = await axios.get<IGallery>(hostname + `/api/events/${id}/gallery/`, {
      params: {
        _limit: limit,
      }
    })
    return response.data
  }

  static async getTicketTypes(id: number): Promise<ITicketType[] | null> {
    const response = await axios.get<ITicketType[]>(hostname + `/api/events/${id}/ticket-types/`)
    return response.data
  }

  static async getComments(id: number): Promise<IReview[] | null> {
    const response = await axios.get<IReview[]>(hostname + `/api/events/${id}/reviews/`)
    return response.data
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
