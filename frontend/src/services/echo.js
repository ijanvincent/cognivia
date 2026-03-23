import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export const getEcho = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) return null;
    if (echoInstance) return echoInstance;

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_APP_KEY,
        wsHost: process.env.REACT_APP_PUSHER_HOST,
        wsPort: parseInt(process.env.REACT_APP_PUSHER_PORT),
        wssPort: parseInt(process.env.REACT_APP_PUSHER_PORT),
        forceTLS: false,
        encrypted: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Platform': 'web',
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'true',
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