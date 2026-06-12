import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Drop-in replacement for expo-secure-store that also works in Expo web
// preview, where the native module is unavailable (an empty object whose
// methods throw on every call). On web we fall back to localStorage; on
// device the real SecureStore keeps tokens in the OS keychain.
const isWeb = Platform.OS === 'web';

export async function getItemAsync(key) {
    if (isWeb) return window.localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
}

export async function setItemAsync(key, value) {
    if (isWeb) {
        window.localStorage.setItem(key, value);
        return;
    }
    return SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key) {
    if (isWeb) {
        window.localStorage.removeItem(key);
        return;
    }
    return SecureStore.deleteItemAsync(key);
}
