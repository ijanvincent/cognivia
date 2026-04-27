import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Syne_700Bold, Syne_400Regular } from '@expo-google-fonts/syne';
import * as SplashScreen from 'expo-splash-screen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import TabNavigator from './TabNavigator';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import Splash from './FirstPage/Splash';
import FlashcardStudyScreen from './screens/FlashcardStudyScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { DeckProvider } from './DeckContext';
import { ThemeProvider } from './ThemeContext';
import RegisterSuccessScreen from './screens/RegisterSuccessScreen';

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