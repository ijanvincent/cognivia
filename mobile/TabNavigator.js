import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from './ThemeContext'; 
import DashboardScreen from './screens/DashboardScreen';
import GenerateScreen from './screens/GenerateScreen';
import ProgressScreen from './screens/ProgressScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  
  const { colors, theme } = useTheme();
  const activeColor = colors.primary;
  const inactiveColor = colors.subtext;
  const tabBarBackgroundColor = colors.card;
  const tabBarBorderColor = colors.border;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Generate') {
          
            iconName = focused ? 'file-upload' : 'file-upload-outline';
          } else if (route.name === 'Progress') {
            
            iconName = focused ? 'chart-line' : 'chart-line-variant';
          }

        
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        
        tabBarActiveTintColor: activeColor,   
        tabBarInactiveTintColor: inactiveColor,     
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          
          backgroundColor: tabBarBackgroundColor,        
          borderTopColor: tabBarBorderColor,
          
          height: Platform.OS === 'ios' ? 90 : 60, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 5, 
          borderTopWidth: 1,                 
          elevation: 10,                     
          shadowColor: '#000',               
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        },
        
        
        headerShown: false,
        
       
        contentStyle: {
            backgroundColor: colors.background,
        }
      })}
    >
      
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Generate" component={GenerateScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;