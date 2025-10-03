import axios from 'axios';
import { API_URL } from './constants';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;

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