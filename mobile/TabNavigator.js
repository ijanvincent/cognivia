import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from './ThemeContext';
import DashboardScreen from './screens/DashboardScreen';
import GenerateScreen  from './screens/GenerateScreen';
import ProgressScreen  from './screens/ProgressScreen';
import ProfileScreen   from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    const { colors } = useTheme();

    const activeColor          = colors.primary;
    const inactiveColor        = colors.subtext;
    const tabBarBackgroundColor = colors.card;
    const tabBarBorderColor    = colors.border;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        // Filled square grid (reference-style dashboard icon)
                        iconName = focused ? 'view-grid' : 'view-grid-outline';
                    } else if (route.name === 'Generate') {
                        // Sparkle / wand — uniform with grid style
                        iconName = focused ? 'creation' : 'creation-outline';
                    } else if (route.name === 'Progress') {
                        // Bar chart — uniform weight with above
                        iconName = focused ? 'chart-bar' : 'chart-bar';
                    } else if (route.name === 'Profile') {
                        // Person icon — replaces the + tab
                        iconName = focused ? 'account-circle' : 'account-circle-outline';
                    }

                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor:   activeColor,
                tabBarInactiveTintColor: inactiveColor,

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.2,
                },

                tabBarStyle: {
                    backgroundColor: tabBarBackgroundColor,
                    borderTopColor:  tabBarBorderColor,
                    height:          Platform.OS === 'ios' ? 90 : 62,
                    paddingBottom:   Platform.OS === 'ios' ? 28 : 6,
                    paddingTop:      4,
                    borderTopWidth:  1,
                    elevation:       10,
                    shadowColor:     '#000',
                    shadowOffset:    { width: 0, height: -2 },
                    shadowOpacity:   0.05,
                    shadowRadius:    6,
                },

                headerShown: false,
            })}
        >
            <Tab.Screen name="Home"     component={DashboardScreen} />
            <Tab.Screen name="Generate" component={GenerateScreen}  />
            <Tab.Screen name="Progress" component={ProgressScreen}  />
            <Tab.Screen name="Profile"  component={ProfileScreen}   />
        </Tab.Navigator>
    );
}

export default TabNavigator;