import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.17:3000/api';
console.log('📡 API URL being used:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': 'mobile',   // NEW — identifies all requests as coming from mobile
    },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');   // CHANGED — was AsyncStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('token');   // CHANGED — was AsyncStorage
            await SecureStore.deleteItemAsync('user');    // CHANGED — was AsyncStorage
        }
        return Promise.reject(error);
    }
);

export default api;