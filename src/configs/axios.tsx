import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `https://crmpro.uz/api/v1/`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Dinamik token qo'shish uchun Interceptor
axiosClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 bo'lsa, foydalanuvchini login sahifasiga yo'naltiring
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
