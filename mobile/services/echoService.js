import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import * as SecureStore from 'expo-secure-store';

const PUSHER_KEY    = process.env.EXPO_PUBLIC_PUSHER_APP_KEY    || 'cognivia-key';
const PUSHER_HOST   = process.env.EXPO_PUBLIC_PUSHER_HOST       || '10.100.220.52';
const PUSHER_PORT   = parseInt(process.env.EXPO_PUBLIC_PUSHER_PORT || '6001');
const PUSHER_CLUSTER = process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';
const API_URL       = process.env.EXPO_PUBLIC_API_URL           || 'http://10.100.220.52:3000/api';

let echoInstance = null;

export const getEcho = async () => {
    if (echoInstance) return echoInstance;

    const token = await SecureStore.getItemAsync('token');
    if (!token) return null;

    const pusherClient = new Pusher(PUSHER_KEY, {
        wsHost:            PUSHER_HOST,
        wsPort:            PUSHER_PORT,
        forceTLS:          false,
        encrypted:         false,
        disableStats:      true,
        enabledTransports: ['ws', 'wss'],
        cluster:           PUSHER_CLUSTER,
    });

    echoInstance = new Echo({
        broadcaster:       'pusher',
        key:               PUSHER_KEY,
        client:            pusherClient,
        authEndpoint:      `${API_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization:              `Bearer ${token}`,
                'X-Platform':               'mobile',
                Accept:                     'application/json',
            },
        },
    });

    return echoInstance;
};

export const disconnectEcho = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
};