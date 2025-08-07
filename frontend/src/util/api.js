import axios from 'axios';

const api = axios.create({
  baseURL: '/',  // proxy 설정에 의해 localhost:8080으로 요청 전달됨
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;