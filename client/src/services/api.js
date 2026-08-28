import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl =
  import.meta.env.PROD && configuredApiUrl?.includes('localhost')
    ? '/api'
    : configuredApiUrl || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (!payload.exp || payload.exp * 1000 > Date.now()) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (typeof data === 'string' && data.trim().startsWith('<!')) {
      return Promise.reject(
        Object.assign(new Error('API returned HTML instead of JSON. Check Vite proxy or VITE_API_URL.'), {
          config: response.config,
        })
      );
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:expired'));
    }

    return Promise.reject(error);
  }
);

export default api;