import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { TensorflowModel, useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import getBestFormat from '../formFilter';
import { useRunOnJS } from 'react-native-worklets-core';


function tensorToString(tensor: TensorflowModel['inputs'][number]): string {
    return `${tensor.dataType} [${tensor.shape}]`;
}

const VIEW_WIDTH = Dimensions.get('screen').width;
const LINE_WIDTH = 2;

function Video(): JSX.Element {
    const [minConfidence, setMinConfidence] = useState(0.25); // Minimum confidence threshold for upper body
    const [lowerBodyConfidenceThreshold, setLowerBodyConfidenceThreshold] = useState(0.35); // For lower body keypoints
    const [feedback, setFeedback] = useState(''); // Feedback for form (Correct/Incorrect)
    const [angle, setAngle] = useState<number | null>(null); // Calculated angle

    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { resize } = useResizePlugin();

    const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
    const plugin = useTensorflowModel(require('./poseModel.tflite'), delegate);

    const format = useMemo(
        () => (device != null ? getBestFormat(device, 720, 1000) : undefined),
        [device],
    );

    const inputTensor = plugin.model?.inputs[0];
    const inputWidth = inputTensor?.shape[1] ?? 0;
    const inputHeight = inputTensor?.shape[2] ?? 0;

    const paint = Skia.Paint();
    paint.setStyle(PaintStyle.Fill);
    paint.setStrokeWidth(LINE_WIDTH);
    paint.setColor(Skia.Color('white'));

    const angleRef = useRef<number | null>(null);
    const feedbackRef = useRef<string>('Correct Form');

    const lines = [
        // left shoulder -> elbow
        5, 7,
        // right shoulder -> elbow
        6, 8,
        // left elbow -> wrist
        7, 9,
        // right elbow -> wrist
        8, 10,
        // left hip -> knee
        11, 13,
        // right hip -> knee
        12, 14,
        // left knee -> ankle
        13, 15,
        // right knee -> ankle
        14, 16,
    
        // left hip -> right hip
        11, 12,
        // left shoulder -> right shoulder
        5, 6,
        // left shoulder -> left hip
        5, 11,
        // right shoulder -> right hip
        6, 12,
      ];

    const SCALE = (format?.videoWidth ?? VIEW_WIDTH) / VIEW_WIDTH;

    const updateAngle = useRunOnJS((angle) => {
        setAngle(angle);
    }, []);
    
    const updateFeedback = useRunOnJS((feedback) => {
        setFeedback(feedback);
    }, []);

    const frameProcessor = useSkiaFrameProcessor(
        (frame) => {
            'worklet';

            frame.render()

            if (plugin.model != null) {
                const smaller = resize(frame, {
                    scale: {
                        width: inputWidth,
                        height: inputHeight,
                    },
                    pixelFormat: 'rgb',
                    dataType: 'uint8',
                });
                const outputs = plugin.model.runSync([smaller]);

                const output = outputs[0];
                const frameWidth = frame.width;
                const frameHeight = frame.height;

                // Extract keypoints
                const xLeftShoulder = Number(output[5 * 3 + 1]) * frameWidth;  // Left Shoulder (5)
                const yLeftShoulder = Number(output[5 * 3]) * frameHeight;

                const xElbow = Number(output[7 * 3 + 1]) * frameWidth;  // Left Elbow (7)
                const yElbow = Number(output[7 * 3]) * frameHeight;

                const xWrist = Number(output[9 * 3 + 1]) * frameWidth;  // Left Wrist (9)
                const yWrist = Number(output[9 * 3]) * frameHeight;

                // Compute segment lengths
                const humerusLength = Math.sqrt((xElbow - xLeftShoulder) ** 2 + (yElbow - yLeftShoulder) ** 2); // Shoulder to Elbow
                const forearmLength = Math.sqrt((xWrist - xElbow) ** 2 + (yWrist - yElbow) ** 2); // Elbow to Wrist
                const shouderToWristLength = Math.sqrt((xWrist - xLeftShoulder) ** 2 + (yWrist - yLeftShoulder) ** 2); // Shoulder to Wrist

                // Use the Law of Cosines to calculate the angle at the elbow (keypoint 7)
                const cosTheta = (humerusLength ** 2 + forearmLength ** 2 - shouderToWristLength ** 2) / (2 * humerusLength * forearmLength);
                const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosTheta))); // Clamp to avoid NaN
                const angleDegrees = (angleRadians * 180) / Math.PI; // Convert to degrees

                // Use `useRunOnJS` to update state
                updateAngle(angleDegrees);

                if (angleDegrees >= 30 && angleDegrees <= 40) {
                    updateFeedback('<30 degrees detected, too tensed, increase angle');
                } else {
                    updateFeedback('Correct Form');
                }

                // Extract keypoints for LEFT arm ONLY
                // 6, 8, and 10 are the right arm (not required for only left bicep curl)
                const keypoints = [5, 7, 9]; // again here 5 = shoulder, 7 = elbow, and 9 = wrist

                for (let i of keypoints) {
                    const confidence = Number(output[i * 3 + 2]);
                    const threshold = minConfidence;
    
                    if (confidence > threshold) {
                        const x = Number(output[i * 3 + 1]) * frameWidth;
                        const y = Number(output[i * 3]) * frameHeight;
    
                        frame.drawCircle(x, y, 2 * SCALE, paint);
                    }
                }
    
                // Define arm connections
                const armLines = [
                    [5, 7], // Left Shoulder to Left Elbow
                    [7, 9], // Left Elbow to Left Wrist
                    // [6, 8], // Right Shoulder to Right Elbow
                    // [8, 10], // Right Elbow to Right Wrist
                ];
    
                for (let [from, to] of armLines) {
                    const confidenceFrom = Number(output[from * 3 + 2]);
                    const confidenceTo = Number(output[to * 3 + 2]);
    
                    if (confidenceFrom > minConfidence && confidenceTo > minConfidence) {
                        const x1 = Number(output[from * 3 + 1]) * frameWidth;
                        const y1 = Number(output[from * 3]) * frameHeight;
                        const x2 = Number(output[to * 3 + 1]) * frameWidth;
                        const y2 = Number(output[to * 3]) * frameHeight;
    
                        frame.drawLine(x1, y1, x2, y2, paint);
                    }
                }
                // ****** BELOW IS FOR DRAWING WHOLE BODY LINES ******
                // for (let i = 5; i < output.length / 3; i++) {
                //     const confidence = Number(output[i * 3 + 2]);
                //     const threshold =
                //         i >= 11 ? lowerBodyConfidenceThreshold : minConfidence;

                //     if (confidence > threshold) {
                //         const x = Number(output[i * 3 + 1]) * frameWidth;
                //         const y = Number(output[i * 3]) * frameHeight;

                //         frame.drawCircle(x, y, 2 * SCALE, paint);
                //     }
                // }

                // for (let i = 0; i < lines.length; i += 2) {
                //     const from = lines[i];
                //     const to = lines[i + 1];

                //     if (from <= 4 || to <= 4) continue;

                //     const confidenceFrom = Number(output[from * 3 + 2]);
                //     const confidenceTo = Number(output[to * 3 + 2]);

                //     const threshold =
                //         from >= 11 || to >= 11
                //             ? lowerBodyConfidenceThreshold
                //             : minConfidence;

                //     if (confidenceFrom > threshold && confidenceTo > threshold) {
                //         const x1 = Number(output[from * 3 + 1]) * frameWidth;
                //         const y1 = Number(output[from * 3]) * frameHeight;
                //         const x2 = Number(output[to * 3 + 1]) * frameWidth;
                //         const y2 = Number(output[to * 3]) * frameHeight;

                //         frame.drawLine(x1, y1, x2, y2, paint);
                //     }
                // }
            }
        },
        [plugin, paint, inputWidth, inputHeight, minConfidence, lowerBodyConfidenceThreshold],
    );

    // Permissions handling
    if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;
    if (device == null) return <NoCameraDeviceError />;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                format={format}
            />
    
            {/* Feedback Overlay */}
            <View style={styles.overlay}>
                <Text
                    style={[
                        styles.feedbackText,
                        feedback.includes('<30 degrees')
                            ? styles.incorrectFeedback // Red for incorrect form
                            : styles.correctFeedback,  // Green for correct form
                    ]}
                >
                    {feedback}: {angle !== null ? `${Math.round(angle)}°` : 'Loading...'}
                </Text>
            </View>
    
            {/* Instruction Overlay */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Keep your back straight and fully extend your arms!
                </Text>
            </View>
        </View>
    );    
}

// Permissions page
type PermissionsPageProps = {
    requestPermission: () => void;
};
const PermissionsPage: React.FC<PermissionsPageProps> = ({ requestPermission }) => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>
            Camera access is required to use this feature.
        </Text>
        <Text style={styles.text}>Please grant permission.</Text>
        <Text style={styles.link} onPress={requestPermission}>
            Grant Permission
        </Text>
    </View>
);
// Component for handling missing camera device
const NoCameraDeviceError = () => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>No camera device found!</Text>
        <Text style={styles.text}>
            Please ensure your device has a working camera.
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    link: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    confidenceText: {
        color: 'Black',
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'Black',
        fontSize: 16,
    },
    feedbackText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    
    correctFeedback: {
        color: 'green', // Green text for correct form
    },
    
    incorrectFeedback: {
        color: 'red', // Red text for incorrect form
    },
    
    overlay: {
        position: 'absolute',
        top: '30%', // 👈 Increase this value if text is not visible
        left: '10%',
        right: '10%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 15,
        borderRadius: 8,
        zIndex: 10,
    },
    
    instructions: {
        position: 'absolute',
        bottom: 80, // Move it slightly higher
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
    },
    
    instructionText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Video;