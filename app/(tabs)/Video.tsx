import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Video } from 'expo-av'; // Optional: For video playback
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';

export default function App() {
    const device = useCameraDevice('back'); // Access the back camera
    const { hasPermission, requestPermission } = useCameraPermission(); // Check camera permissions
    const cameraRef = useRef<Camera>(null); // Reference to the camera
    const [isRecording, setIsRecording] = useState(false); // Track recording state
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions(); // Media library permissions
    const isFocused = useIsFocused(); // Ensure the camera is active only when the screen is focused

    // Ensure media library permission is granted
    if (!mediaLibraryPermission?.granted) {
        return (
            <PermissionsPage
                requestPermission={requestMediaLibraryPermission}
                text="Media library access is required to save videos."
            />
        );
    }

    // Show permission request screen if permission is not granted
    if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;

    // Handle no camera device error
    if (device == null) return <NoCameraDeviceError />;

    // Function to handle video recording
    const handleRecordVideo = async () => {
        try {
            if (!cameraRef.current) return;
            setIsRecording(true);

            await cameraRef.current.startRecording({
                onRecordingFinished: async (video) => {
                    setIsRecording(false);

                    try {
                        // Save video to media library
                        const asset = await MediaLibrary.createAssetAsync(video.path);
                        Alert.alert('Success', `Video saved to your library: ${asset.uri}`);
                    } catch (error) {
                        Alert.alert('Error', `Failed to save video: ${error}`);
                    }
                },
                onRecordingError: (error) => {
                    setIsRecording(false);
                    Alert.alert('Error', `Recording error: ${error.message}`);
                },
            });
        } catch (error) {
            setIsRecording(false);
            Alert.alert('Error', `Failed to start recording: ${error}`);
        }
    };

    // Function to stop video recording
    const handleStopRecording = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
        }
    };

    return (
        <View style={styles.container}>
            {device && (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    ref={cameraRef}
                    isActive={isFocused}
                    video={true}
                />
            )}

            <View style={styles.controls}>
                {!isRecording ? (
                    <TouchableOpacity onPress={handleRecordVideo} style={styles.recordButton}>
                        <Text style={styles.buttonText}>Record</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleStopRecording} style={styles.stopButton}>
                        <Text style={styles.buttonText}>Stop</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// Define Props Type for PermissionsPage
type PermissionsPageProps = {
    requestPermission: () => void;
    text?: string;
};

// Component to request permissions
const PermissionsPage: React.FC<PermissionsPageProps> = ({ requestPermission, text }) => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>{text || 'Camera access is required to use this feature.'}</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
    </View>
);

// Component for handling missing camera device
const NoCameraDeviceError = () => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>No camera device found!</Text>
        <Text style={styles.text}>Please ensure your device has a working camera.</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 50,
    },
    stopButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    permissionButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
    },
});