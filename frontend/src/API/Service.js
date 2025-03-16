import axios from 'axios';

const hostname = 'http://localhost:8000/';

export default class EventService {
  static async getAll() {
    const response = await axios.get(`${hostname}/api/events`);
    return response;
  }

  static async getById(id) {
    const response = await axios.get(`${hostname}/api/events/${id}`);
    return response;
  }
}
