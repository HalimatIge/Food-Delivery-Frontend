// config/axios.js
import axios from 'axios';
import { API_URL } from './constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await axiosInstance.get('/api/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';
// import { API_URL } from './constants';

// axios.defaults.baseURL = API_URL;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// export default axios;

// import axios from 'axios';
// import { API_URL } from './constants';

// const instance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export default instance;