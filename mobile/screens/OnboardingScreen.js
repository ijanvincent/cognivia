import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Dimensions, Animated, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const C = {
    bg:           '#07080f',
    text:         '#ffffff',
    muted:        'rgba(255,255,255,0.35)',
    dotActive:    '#ffffff',
    btnBg:        '#ffffff',
    btnText:      '#07080f',
    outlineBorder:'rgba(255,255,255,0.55)',
};

const SLIDES = [
    {
        id:   '1',
        title:'Intelligent\nLearning.',
        body: 'AI that adapts to how you think, study, and grow.',
    },
    {
        id:   '2',
        title:'Study\nSmarter.',
        body: 'Generate flashcards from any document in seconds.',
    },
    {
        id:   '3',
        title:'Track Your\nGrowth.',
        body: 'See your mastery improve with every single session.',
    },
    {
        id:   '4',
        title:'Start Your\nJourney.',
        body: 'Join thousands of learners already levelling up with CogniVia.',
    },
];


const WaveBackground = () => (
    <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
    >
       
        {[...Array(8)].map((_, i) => (
            <Path
                key={`pink-${i}`}
                d={`M ${-20 + i * 6} ${200 + i * 8} C ${80 + i * 5} ${80 + i * 6}, ${220 + i * 3} ${340 + i * 4}, ${300 + i * 5} ${160 + i * 5} S ${380 + i * 3} ${400 + i * 3}, ${460 + i * 4} ${240 + i * 4}`}
                fill="none"
                stroke={`rgba(200, 80, 200, ${0.35 - i * 0.03})`}
                strokeWidth="1.2"
            />
        ))}
       
        {[...Array(8)].map((_, i) => (
            <Path
                key={`cyan-${i}`}
                d={`M ${200 + i * 5} ${700} C ${280 + i * 4} ${520 + i * 5}, ${340 + i * 3} ${640 + i * 3}, ${420 + i * 4} ${440 + i * 5} S ${500 + i * 3} ${600 + i * 3}, ${560 + i * 4} ${480 + i * 4}`}
                fill="none"
                stroke={`rgba(30, 180, 255, ${0.35 - i * 0.03})`}
                strokeWidth="1.2"
            />
        ))}
  
        {[...Array(5)].map((_, i) => (
            <Path
                key={`purple-${i}`}
                d={`M ${80 + i * 10} ${400 + i * 4} C ${160 + i * 6} ${240 + i * 5}, ${280 + i * 4} ${560 + i * 3}, ${400 + i * 5} ${320 + i * 4}`}
                fill="none"
                stroke={`rgba(130, 80, 255, ${0.22 - i * 0.02})`}
                strokeWidth="1"
            />
        ))}
    </Svg>
);


const Dot = ({ index, scrollX }) => {
    const width = scrollX.interpolate({
        inputRange:  [(index - 1) * W, index * W, (index + 1) * W],
        outputRange: [8, 28, 8],
        extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
        inputRange:  [(index - 1) * W, index * W, (index + 1) * W],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
    });
    return <Animated.View style={[styles.dot, { width, opacity }]} />;
};


const PressBtn = ({ onPress, style, children }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={() =>
                    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()
                }
                onPressOut={() =>
                    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()
                }
                onPress={onPress}
                style={style}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};


const Slide = ({ item }) => (
    <View style={styles.slide}>
     
        <WaveBackground />
     
        <View style={styles.overlay} />
   
        <View style={styles.iconArea} />

        <View style={styles.textArea}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
        </View>
    </View>
);

const OnboardingScreen = () => {
    const navigation  = useNavigation();
    const scrollX     = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const isLast = activeIdx === SLIDES.length - 1;

    const handleSkip = () => {
        const lastIndex = SLIDES.length - 1;
        Animated.timing(scrollX, {
            toValue:         lastIndex * W,
            duration:        500,
            useNativeDriver: false,
        }).start();
        flatListRef.current?.scrollToIndex({ index: lastIndex, animated: true });
        setActiveIdx(lastIndex);
    };

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
            listener: (e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / W);
                setActiveIdx(idx);
            },
        }
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" backgroundColor={C.bg} translucent={false} />

            {!isLast ? (
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>SKIP</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.skipPlaceholder} />
            )}

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                bounces={false}
                renderItem={({ item }) => <Slide item={item} />}
                style={styles.flatList}
            />

            <View style={styles.bottom}>
                <View style={styles.dotsRow}>
                    {SLIDES.map((_, i) => (
                        <Dot key={i} index={i} scrollX={scrollX} />
                    ))}
                </View>

                <View style={styles.buttonsSection}>
                    {isLast ? (
                        <>
                            <PressBtn
                                onPress={() => navigation.replace('Login')}
                                style={styles.btnPrimary}
                            >
                                <Text style={styles.btnPrimaryText}>SIGN IN</Text>
                            </PressBtn>
                            <PressBtn
                                onPress={() => navigation.replace('Register')}
                                style={styles.btnOutline}
                            >
                                <Text style={styles.btnOutlineText}>CREATE ACCOUNT</Text>
                            </PressBtn>
                        </>
                    ) : (
                        <PressBtn
                            onPress={() => navigation.replace('Register')}
                            style={styles.btnPrimary}
                        >
                            <Text style={styles.btnPrimaryText}>CREATE ACCOUNT</Text>
                        </PressBtn>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea:        { flex: 1, backgroundColor: C.bg },
    flatList:        { flex: 1 },

    skipBtn:         { alignSelf: 'flex-end', paddingHorizontal: 28, paddingTop: 12, paddingBottom: 8, zIndex: 10 },
    skipPlaceholder: { height: 40 },
    skipText:        { fontSize: 12, color: C.muted, fontWeight: '700', letterSpacing: 2 },

    slide:    { width: W, flex: 1, justifyContent: 'space-between' },
    overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,8,15,0.45)' },
    iconArea: { flex: 1 },

    textArea: {
        paddingHorizontal: 28,
        paddingBottom:     H * 0.10,
        zIndex:            1,
    },

    title: {
        fontSize:     H * 0.058,
        fontWeight:   '800',
        color:        C.text,
        letterSpacing:-2,
        lineHeight:   H * 0.068,
        marginBottom: H * 0.018,
        fontFamily:   Platform.OS === 'android' ? 'sans-serif-black' : undefined,
    },

    body: {
        fontSize:      H * 0.020,
        lineHeight:    H * 0.030,
        color:         'rgba(255,255,255,0.75)',
        fontWeight:    '400',
        fontFamily:    Platform.OS === 'android' ? 'sans-serif' : undefined,
        letterSpacing: 0,
        maxWidth:      '90%',
    },

    bottom:   { backgroundColor: C.bg },
    dotsRow:  {
        flexDirection:   'row',
        justifyContent:  'center',
        alignItems:      'center',
        gap:             6,
        paddingVertical: H * 0.025,
    },
    dot: { height: 6, borderRadius: 3, backgroundColor: C.dotActive },

    buttonsSection: {
        paddingHorizontal: 20,
        gap:               10,
        paddingBottom:     H * 0.025,
    },
    btnPrimary: {
        height:          H * 0.072,
        backgroundColor: C.btnBg,
        borderRadius:    16,
        alignItems:      'center',
        justifyContent:  'center',
    },
    btnPrimaryText:  { fontSize: 13, fontWeight: '700', color: C.btnText, letterSpacing: 2 },
    btnOutline: {
        height:         H * 0.066,
        borderRadius:   16,
        borderWidth:    1.5,
        borderColor:    C.outlineBorder,
        alignItems:     'center',
        justifyContent: 'center',
    },
    btnOutlineText:  { fontSize: 13, fontWeight: '700', color: C.text, letterSpacing: 2 },
});

export default OnboardingScreen;