import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useGlobalStyle from '../hooks/GlobalStyleContext';

export default function TabLayout() {
    const styles = useGlobalStyle()
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: styles.colors.primary,
                tabBarInactiveTintColor: styles.colors.secondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: styles.colors.bgColor, // Background color
                    borderTopWidth: 0,
                    height: 55, // Reduced height for a tighter look
                    paddingTop: 0,
                    paddingBottom: 0, // Removing extra padding
                },
                tabBarLabelStyle: {
                    fontFamily: styles.fontStyle.textFont, // Custom font
                    fontSize: styles.fontSize.xs, // Even smaller font size
                    fontWeight: 'bold', // Optional
                    marginBottom: -2, // Bring text closer to the icons
                },
                tabBarItemStyle: {
                    paddingHorizontal: -5, // Reduce horizontal spacing
                    marginHorizontal: -2, // Reduce margin between tabs
                }
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Video"
                options={{
                    title: 'Video',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="video-camera" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="WorkoutPlan"
                options={{
                    title: 'Plan',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="calendar-today" size={size - 6} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="MealPlan"
                options={{
                    title: 'Meal',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="fastfood" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size - 6} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
