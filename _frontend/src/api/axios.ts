import axios from 'axios';

export const publicAxiosInstance = axios.create({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
