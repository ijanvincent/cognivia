import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar, Easing } from 'react-native';

export default function Splash({ navigation }) {
    const opacity    = useRef(new Animated.Value(0)).current;
    const scale      = useRef(new Animated.Value(0.85)).current;
    const exitOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
     
        Animated.parallel([
            Animated.timing(opacity, {
                toValue:         1,
                duration:        700,
                easing:          Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue:         1,
                duration:        800,
                easing:          Easing.out(Easing.back(1.3)),
                useNativeDriver: true,
            }),
        ]).start(() => {
       
            setTimeout(() => {
                Animated.timing(exitOpacity, {
                    toValue:         0,
                    duration:        500,
                    easing:          Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }).start(() => navigation.replace('Onboarding'));
            }, 1200);
        });
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: exitOpacity }]}>
            <StatusBar barStyle="light-content" backgroundColor="#07080f" />
            <Animated.Image
                source={require('../assets/icon.png')}
                style={[styles.logo, { opacity, transform: [{ scale }] }]}
                resizeMode="contain"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#07080f', alignItems: 'center', justifyContent: 'center' },
    logo:      { width: 160, height: 160 },
});