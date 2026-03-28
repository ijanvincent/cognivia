import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://intercity-nonbibulously-brylee.ngrok-free.dev/api';
console.log('📡 API URL being used:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': 'mobile',
        'ngrok-skip-browser-warning': 'true',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
        }
        return Promise.reject(error);
    }
);

export default api;