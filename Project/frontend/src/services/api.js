import axios from 'axios';

const API_URL = "https://orion-dewp.onrender.com/";

export const getHello = async () => {
  const response = await fetch(API_URL);
  return await response.text();
};

// 🟢 ADICIONAR ISTO
const api = axios.create({
    baseURL: 'https://orion-dewp.onrender.com/api'
});

// Envia o token automaticamente em todos os pedidos
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Se o token expirar, volta para o login
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;