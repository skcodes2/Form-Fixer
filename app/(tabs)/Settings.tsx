import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Switch, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useGlobalStyle from '../hooks/GlobalStyleContext';
import { useRouter } from 'expo-router';
import useUser from '../hooks/UserContext';
import AuthPost from '../../Fetchers/Auth/AuthPost';
import { host } from '../index';
import useWorkoutPlan from 'app/hooks/WorkoutPlanContext';
import Routine from 'app/WorkoutPlan/Routine';
import Plan from 'app/WorkoutPlan/Plan';

export default function Settings() {
    const globalStyle = useGlobalStyle();
    const router = useRouter();
    const { user, token, setToken, setUser } = useUser();
    const defaultRoutine = new Routine("Routine 1", null)
    const { setWorkoutPlans, setActivePlan, setChosenExercise, setTemporyPlansFetched, setRoutines, setFetched, setActiveRoutine, setWorkoutPlanFetched } = useWorkoutPlan();

    const [dropdowns, setDropdowns] = useState({
        notification: false,
        privacy: false,
        about: false,
        terms: false,
    });

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

    // Build the full image URL if user.profilePicture exists
    const getFullProfileImage = () => {
        if (user?.profilePicture) {
            return `${host}${user.profilePicture}`;
        }
        return null;
    };

    // Local state for immediate updates (if needed)
    const [profileImage, setProfileImage] = useState(getFullProfileImage());

    // Update local state when user changes (e.g. after login or profile update)
    useEffect(() => {
        setProfileImage(getFullProfileImage());
    }, [user]);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found. Please log in.</Text>
            </View>
        );
    }

    const toggleDropdown = (section: keyof typeof dropdowns) => {
        setDropdowns((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleNotifications = () => {
        setIsNotificationsEnabled((prev) => !prev);
        Alert.alert('Notification Settings', isNotificationsEnabled ? 'Notifications Disabled' : 'Notifications Enabled');
    };

    const handleSignOut = () => {
        AuthPost(
            `${host}/users/signout`,
            {},
            (error) => Alert.alert(error),
            token
        );
        setUser(null);
        setToken('');
        setFetched(false)
        setRoutines([defaultRoutine])
        setWorkoutPlans([new Plan("WorkoutPlan", [defaultRoutine])])
        setActivePlan(new Plan("WorkoutPlan", [defaultRoutine]))
        setActiveRoutine(defaultRoutine)
        setChosenExercise(undefined)
        setWorkoutPlanFetched(false)
        setTemporyPlansFetched(false)
        router.replace('/');
    };

    const pickImage = async () => {
        try {
            // Request media library permissions
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'We need permission to access your gallery to update the profile picture.');
                    return;
                }
            }

            // Open image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All, // Updated to MediaTypeOptions.All
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets[0]?.uri) {
                const selectedImage = result.assets[0].uri;
                setProfileImage(selectedImage); // Update the profile image
                await uploadProfilePicture(selectedImage); // Upload the image
            } else {
                Alert.alert('Error', 'No image was selected.');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Unable to select an image. Please try again.');
        }
    };

    const uploadProfilePicture = async (imageUri: string) => {
        try {
            const formData = new FormData();
            const fileName = imageUri.split("/").pop() || "profile_picture.jpg";

            formData.append("profilePicture", {
                uri: imageUri,
                name: fileName,
                type: "image/jpeg",
            } as any);

            const response = await fetch(`${host}/users/update-profile-picture`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type' must NOT be set manually for FormData
                },
                body: formData,
            });

            // Check for server errors
            if (!response.ok) {
                const errorText = await response.text(); // Read the raw response text
                console.error("Server error response:", errorText);
                throw new Error(`Failed to upload profile picture. Server responded with: ${errorText}`);
            }

            // Parse JSON response
            const data = await response.json();

            // Notify the user of success
            Alert.alert("Success", "Profile picture updated successfully!");

            // Update user context with the new profile picture URL
            setUser({ ...user, profilePicture: data.imageUrl });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error uploading profile picture:", error.message);
            } else {
                console.error("Unexpected error", error);
            }
            Alert.alert("Error", "Something went wrong while uploading your profile picture. Please try again.");
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={
                            profileImage
                                ? { uri: profileImage }
                                : require('../../assets/images/profile.png') // Ensure this path is correct
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={[styles.userName, { fontFamily: globalStyle.fontStyle.textFont }]}>
                    {user?.fname || 'User'} {user?.lname || ''}
                </Text>
                <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <FontAwesome name="edit" size={18} color={globalStyle.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/AccountSettingPage')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Account</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => toggleDropdown('notification')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Notification</Text>
                    <FontAwesome
                        name={dropdowns.notification ? 'chevron-down' : 'chevron-right'}
                        size={18}
                        color={globalStyle.colors.secondary}
                    />
                </TouchableOpacity>
                {dropdowns.notification && (
                    <View style={styles.dropdownContainer}>
                        <Text style={[styles.dropdownText, { fontFamily: globalStyle.fontStyle.textFont }]}>
                            Allow Notifications
                        </Text>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#767577', true: globalStyle.colors.primary }}
                            thumbColor={isNotificationsEnabled ? globalStyle.colors.secondary : '#f4f3f4'}
                        />
                    </View>
                )}

                <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                    <Text
                        style={[
                            styles.menuText,
                            { fontFamily: globalStyle.fontStyle.textFont, color: globalStyle.colors.primary },
                        ]}
                    >
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 120,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
    },
    menu: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },
    menuText: {
        fontSize: 18,
        color: '#fff',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
    },
});
