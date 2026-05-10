import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from './ThemeContext';
import DashboardScreen from './screens/DashboardScreen';
import GenerateScreen from './screens/GenerateScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import api from './services/api';
import { getEcho } from './services/echoService';

const Tab = createBottomTabNavigator();
const APPROVAL_TTL_SECONDS = 60;

function TabNavigator() {
    const { colors } = useTheme();

    const [incomingRequest, setIncomingRequest] = useState(null);
    const [isActioning, setIsActioning] = useState(false);
    const [actionError, setActionError] = useState('');

    const activeColor = colors.primary;
    const inactiveColor = colors.subtext;
    const tabBarBackgroundColor = colors.card;
    const tabBarBorderColor = colors.border;

    useEffect(() => {
        let mounted = true;

        const setupIncomingLoginListener = async () => {
            try {
                const storedUserRaw = await SecureStore.getItemAsync('user');
                if (!storedUserRaw || !mounted) return;

                const storedUser = JSON.parse(storedUserRaw);
                if (!storedUser?.id) return;

                const echo = await getEcho();
                if (!echo || !mounted) return;

                echo.private(`user.${storedUser.id}`)
                    .listen('.new.login.request', (event) => {
                        setActionError('');
                        setIncomingRequest({
                            approvalToken: event.approval_token,
                            requestingPlatform: event.requesting_platform,
                            expiresIn: event.expires_in ?? APPROVAL_TTL_SECONDS,
                        });
                    });
            } catch (error) {
                console.warn('[CogniVia] Incoming login listener setup failed:', error?.message);
            }
        };

        setupIncomingLoginListener();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!incomingRequest) return undefined;

        const timer = setTimeout(() => {
            setIncomingRequest(null);
            setIsActioning(false);
        }, incomingRequest.expiresIn * 1000);

        return () => clearTimeout(timer);
    }, [incomingRequest]);

    useEffect(() => {
        let stopped = false;

        const checkPendingLogin = async () => {
            if (stopped || incomingRequest || isActioning) return;

            try {
                const response = await api.get('/auth/login/pending');
                const pending = response.data?.pending_login;

                if (!pending || stopped) return;

                setActionError('');
                setIncomingRequest({
                    pendingLoginId: pending.id,
                    approvalToken: null,
                    requestingPlatform: pending.requesting_platform,
                    expiresIn: pending.expires_in ?? APPROVAL_TTL_SECONDS,
                });
            } catch (error) {
                // Polling is a fallback for realtime; avoid interrupting the user on transient network errors.
            }
        };

        checkPendingLogin();
        const interval = setInterval(checkPendingLogin, 3000);

        return () => {
            stopped = true;
            clearInterval(interval);
        };
    }, [incomingRequest, isActioning]);

    const respondToLoginRequest = async (action) => {
        if (!incomingRequest?.approvalToken && !incomingRequest?.pendingLoginId) return;

        setIsActioning(true);
        setActionError('');

        try {
            const payload = incomingRequest.approvalToken
                ? { approval_token: incomingRequest.approvalToken }
                : { pending_login_id: incomingRequest.pendingLoginId };

            await api.post(`/auth/login/${action}`, payload);
            setIncomingRequest(null);
        } catch (error) {
            setActionError(`Could not ${action} this sign-in request. Please try again.`);
        } finally {
            setIsActioning(false);
        }
    };

    return (
        <>
            <Modal
                visible={!!incomingRequest}
                transparent
                animationType="fade"
                statusBarTranslucent
            >
                <View style={styles.scrim}>
                    <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.iconCircle, { borderColor: colors.primary, backgroundColor: `${colors.primary}1A` }]}>
                            <MaterialCommunityIcons name="shield-account-outline" size={28} color={colors.primary} />
                        </View>

                        <Text style={[styles.modalTitle, { color: colors.text }]}>New Sign-In Request</Text>
                        <Text style={[styles.modalBody, { color: colors.subtext }]}>
                            Someone is trying to sign in to your account from a{' '}
                            <Text style={{ color: colors.text, fontWeight: '700' }}>
                                {incomingRequest?.requestingPlatform === 'web' ? 'web browser' : 'mobile device'}
                            </Text>
                            . Is this you?
                        </Text>

                        {!!actionError && (
                            <Text style={styles.errorText}>{actionError}</Text>
                        )}

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.denyButton, isActioning && styles.disabledButton]}
                                onPress={() => respondToLoginRequest('deny')}
                                disabled={isActioning}
                                activeOpacity={0.82}
                            >
                                {isActioning ? (
                                    <ActivityIndicator size="small" color="#f87171" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="close" size={16} color="#f87171" />
                                        <Text style={styles.denyText}>Deny</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.allowButton, isActioning && styles.disabledButton]}
                                onPress={() => respondToLoginRequest('approve')}
                                disabled={isActioning}
                                activeOpacity={0.88}
                            >
                                {isActioning ? (
                                    <ActivityIndicator size="small" color="#07080f" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="check" size={16} color="#07080f" />
                                        <Text style={styles.allowText}>Allow</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'view-grid' : 'view-grid-outline';
                        } else if (route.name === 'Generate') {
                            iconName = focused ? 'creation' : 'creation-outline';
                        } else if (route.name === 'Progress') {
                            iconName = focused ? 'chart-bar' : 'chart-bar';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'account-circle' : 'account-circle-outline';
                        }

                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                    },

                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,

                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        letterSpacing: 0.2,
                    },

                    tabBarStyle: {
                        backgroundColor: tabBarBackgroundColor,
                        borderTopColor: tabBarBorderColor,
                        height: Platform.OS === 'ios' ? 90 : 62,
                        paddingBottom: Platform.OS === 'ios' ? 28 : 6,
                        paddingTop: 4,
                        borderTopWidth: 1,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                    },

                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={DashboardScreen} />
                <Tab.Screen name="Generate" component={GenerateScreen} />
                <Tab.Screen name="Progress" component={ProgressScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    scrim: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        backgroundColor: 'rgba(7,8,15,0.84)',
    },
    modalCard: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalBody: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
    },
    errorText: {
        color: '#f87171',
        fontSize: 13,
        lineHeight: 19,
        marginTop: 12,
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        marginVertical: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    denyButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(248,113,113,0.4)',
        backgroundColor: 'rgba(248,113,113,0.08)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    allowButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    denyText: {
        color: '#f87171',
        fontSize: 15,
        fontWeight: '700',
    },
    allowText: {
        color: '#07080f',
        fontSize: 15,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.65,
    },
});

export default TabNavigator;
