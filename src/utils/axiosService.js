import axios from 'axios';

// const baseURL = 'http://localhost:3000/v1';
const baseURL = 'https://7jvk31k960.execute-api.us-east-1.amazonaws.com/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to set the 'Authorization' header before each request is sent
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('ACCESS_TOKEN_KEY');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const catchAuthError = (fn) => {
  try {
    return fn();
  } catch (error) {
    const statusCode = parseInt(error.response.status, 10);
    if (statusCode === 401 || statusCode === 403) {
      window.location.href = '/auth/sign-in';
      return null;
    }
    throw error;
  }
};

const get = (url, params) =>
  catchAuthError(() => {
    return api.get(url, { params });
  });
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
