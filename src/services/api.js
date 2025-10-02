import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5005/api",
  withCredentials: true, // sends HTTP-only cookies
});

export default api;
