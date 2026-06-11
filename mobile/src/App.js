import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Syne_700Bold, Syne_400Regular } from '@expo-google-fonts/syne';
import * as SplashScreen from 'expo-splash-screen';
import TabNavigator from './navigation/TabNavigator';
import { DeckProvider } from './contexts/DeckContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Splash from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import RegisterSuccessScreen from './screens/auth/RegisterSuccessScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import FlashcardStudyScreen from './screens/FlashcardStudyScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();


const linking = {
    prefixes: ['cognivia://'],
    config: {
        screens: {
            ResetPassword: {
                path: 'reset-password',
                parse: {
                    token: (token) => token,
                    email: (email) => decodeURIComponent(email),
                },
            },
        },
    },
};

const HomeTabsWithContext = () => (
    <DeckProvider>
        <TabNavigator />
    </DeckProvider>
);

function App() {
    const [fontsLoaded] = useFonts({
        Syne_700Bold,
        Syne_400Regular,
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <ThemeProvider>
            <NavigationContainer linking={linking}>
                <Stack.Navigator
                    initialRouteName="Splash"
                    screenOptions={{ headerShown: false }}
                >
                    <Stack.Screen name="Splash"         component={Splash} />
                    <Stack.Screen name="Onboarding"     component={OnboardingScreen} />
                    <Stack.Screen name="Login"          component={LoginScreen} />
                    <Stack.Screen name="Register"       component={RegisterScreen} />
                    <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword"  component={ResetPasswordScreen} />
                    <Stack.Screen name="Profile"        component={ProfileScreen} />
                    <Stack.Screen name="About"          component={AboutScreen} />
                    <Stack.Screen name="HomeTabs"       component={HomeTabsWithContext} />
                    <Stack.Screen name="FlashcardStudy" component={FlashcardStudyScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}

export default App;