import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Video, ResizeMode } from 'expo-av'; // video preview library ***
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';

export default function App() {
    const device = useCameraDevice('back'); // access to back camera of device
    // check for perms from user
    const { hasPermission, requestPermission } = useCameraPermission();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

    const cameraRef = useRef<Camera>(null);
    const [isRecording, setIsRecording] = useState(false); // track recording state
    const isFocused = useIsFocused(); // camera only works if screen is focused

    // previewing video states
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null); // store the recorded video URI
    const [isPreviewVisible, setIsPreviewVisible] = useState(false); // control the preview modal visibility

    // ensure media library perms granted to save videos
    if (!mediaLibraryPermission?.granted) {
        return (
            <PermissionsPage
                requestPermission={requestMediaLibraryPermission}
                text="Media library access is required to save videos."
            />
        );
    }

    // handle no perms error
    if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;
    // handle no camera device error
    if (device == null) return <NoCameraDeviceError />;

    // HANDLE RECORD
    const handleRecordVideo = async () => {
        try {
            if (!cameraRef.current) return;
            setIsRecording(true);

            await cameraRef.current.startRecording({
                onRecordingFinished: (video) => {
                    setIsRecording(false);
                    setRecordedVideo(video.path); // Store the video path
                    setIsPreviewVisible(true); // Show the preview modal
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

    // HANDLE STOP RECORD
    const handleStopRecording = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
        }
    };

    // HANDLE SAVE VIDEO
    const handleSaveVideo = async () => {
        try {
            if (recordedVideo) {
                const asset = await MediaLibrary.createAssetAsync(recordedVideo);
                Alert.alert('Success', `Video saved to your library: ${asset.uri}`);
                setIsPreviewVisible(false);
                setRecordedVideo(null);
            }
        } catch (error) {
            Alert.alert('Error', `Failed to save video: ${error}`);
        }
    };

    // HANDLE DISCARD VIDEO
    const handleDiscardVideo = () => {
        setIsPreviewVisible(false);
        setRecordedVideo(null);
    };

    return (
        <View style={styles.container}>
            {device && (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    ref={cameraRef}
                    isActive={isFocused && !isPreviewVisible}
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

            {isPreviewVisible && recordedVideo && (
                <Modal visible={isPreviewVisible} animationType="slide">
                    <View style={styles.previewContainer}>
                        <Video
                            source={{ uri: recordedVideo }}
                            style={styles.video}
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            isLooping
                        />
                        <View style={styles.previewControls}>
                            <TouchableOpacity onPress={handleSaveVideo} style={styles.saveButton}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDiscardVideo} style={styles.discardButton}>
                                <Text style={styles.buttonText}>Discard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
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
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    video: {
        width: '100%',
        height: '80%',
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 20,
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
    },
    discardButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
    },
});