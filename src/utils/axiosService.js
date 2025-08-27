import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Add a request interceptor to set the 'Authorization' header before each request is sent
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('ACCESS_TOKEN_KEY');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN_KEY');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${baseURL}/auth/refresh-tokens`, {
          refreshToken,
        });

        const newAccessToken = response.data.access.token;
        localStorage.setItem('ACCESS_TOKEN_KEY', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('ACCESS_TOKEN_KEY');
        localStorage.removeItem('REFRESH_TOKEN_KEY');
        
        // Only show one toast and redirect
        if (!window.location.pathname.includes('/auth/')) {
          toast.error('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/auth/sign-in';
          }, 1000);
        }
        return Promise.reject(refreshError);
      }
    }

    // For other 4xx/5xx errors, don't show multiple toasts
    if (error.response?.status >= 400) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const get = (url, params) => api.get(url, { params });
const post = (url, data) => api.post(url, data);
const patch = (url, data) => api.patch(url, data);
const del = (url) => api.delete(url);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get,
  post,
  patch,
  delete: del,
};
