// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import useGlobalStyle from "../hooks/GlobalStyleContext";

export default function TabLayout() {
    const styles = useGlobalStyle();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: styles.colors.primary,
                tabBarInactiveTintColor: styles.colors.secondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: styles.colors.bgColor,
                    borderTopWidth: 0,
                    height: 55,
                    paddingTop: 0,
                    paddingBottom: 0,
                },
                tabBarLabelStyle: {
                    fontFamily: styles.fontStyle.textFont,
                    fontSize: styles.fontSize.xs,
                    fontWeight: "bold",
                    marginBottom: -2,
                },
                tabBarItemStyle: {
                    paddingHorizontal: -5,
                    marginHorizontal: -2,
                },
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Video"
                options={{
                    title: "Video",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="video-camera" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="WorkoutPlan"
                options={{
                    title: "Plan",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="calendar-today" size={size - 6} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="MealPlan"
                options={{
                    title: "Meal",
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
    );
}
