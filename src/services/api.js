import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // sends HTTP-only cookies
});

export default api;
