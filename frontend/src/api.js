import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  // baseURL: API_URL,
//  baseURL: "http://127.0.0.1:8080",
  baseURL : import.meta.env.VITE_API_URL,
});

export default apiClient;
