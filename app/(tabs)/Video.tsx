import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    Modal,
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


// function tensorToString(tensor: TensorflowModel['inputs'][number]): string {
//     return `${tensor.dataType} [${tensor.shape}]`;
// }



const VIEW_WIDTH = Dimensions.get('screen').width;
const LINE_WIDTH = 2;

function Video(): JSX.Element {
    const [minConfidence, setMinConfidence] = useState(0.25); // Minimum confidence threshold for upper body
    const [lowerBodyConfidenceThreshold, setLowerBodyConfidenceThreshold] = useState(0.35); // For lower body keypoints
    const [feedback, setFeedback] = useState(''); // Feedback for form (Correct/Incorrect)
    const [rFeedback, setRFeedback] = useState(''); // Feedback for right arm
    const [angle, setAngle] = useState<number | null>(null); // Calculated angle
    const [rightArmAngle, setRightArmAngle] = useState<number | null>(null); // Calculated angle for right
    const [exerciseName, setExerciseName] = useState("")
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { resize } = useResizePlugin();
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [down, setDown] = useState(false);
    const [up, setUp] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const [start, setStart] = useState(false);

    const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
    const plugin = useTensorflowModel(require('./poseModel.tflite'), delegate);

    const handleSelectExercise = (name: string) => {
        setExerciseName(name);
        setIsModalVisible(false);
    };
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

    const updateStart = useRunOnJS((start) => { setStart(start); }, []);

    const updateAngleRight = useRunOnJS((angle) => {
        setRightArmAngle(angle);
    }, []);

    const updateRightFeedback = useRunOnJS((feedback) => {
        setRFeedback(feedback);
    }, []);

    const updateFeedback = useRunOnJS((feedback) => {
        setFeedback(feedback);
    }, []);

    const updateUp = useRunOnJS((feedback) => {
        setUp(feedback);
    }
        , []);

    const updateDown = useRunOnJS((feedback) => {
        setDown(feedback);
    }
        , []);

    const repCounter = useRunOnJS((feedback) => {
        setRepCount(feedback);
    }
        , []);

    const frameProcessor = useSkiaFrameProcessor(
        (frame) => {
            'worklet';
            if (exerciseName !== "") {
                frame.render()
            }
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

                if (start) {

                    // Extract keypoints for LEFT arm ONLY
                    const xLeftShoulder = Number(output[5 * 3 + 1]) * frameWidth;  // Left Shoulder (5)
                    const yLeftShoulder = Number(output[5 * 3]) * frameHeight;

                    const xElbow = Number(output[7 * 3 + 1]) * frameWidth;  // Left Elbow (7)
                    const yElbow = Number(output[7 * 3]) * frameHeight;

                    const xWrist = Number(output[9 * 3 + 1]) * frameWidth;  // Left Wrist (9)
                    const yWrist = Number(output[9 * 3]) * frameHeight;

                    // Right arm keypoints
                    if (exerciseName === "Shoulder Press") {
                        const xRightShoulder = Number(output[6 * 3 + 1]) * frameWidth;  // Right Shoulder (6)
                        const yRightShoulder = Number(output[6 * 3]) * frameHeight;

                        const xRElbow = Number(output[8 * 3 + 1]) * frameWidth;  // Right Elbow (8)
                        const yRElbow = Number(output[8 * 3]) * frameHeight;

                        const xRWrist = Number(output[10 * 3 + 1]) * frameWidth;  // Right Wrist (10)
                        const yRWrist = Number(output[10 * 3]) * frameHeight;

                        // Compute segment lengths for right arm
                        const rhumerusLength = Math.sqrt((xRElbow - xRightShoulder) ** 2 + (yRElbow - yRightShoulder) ** 2); // Shoulder to Elbow
                        const rforearmLength = Math.sqrt((xRWrist - xRElbow) ** 2 + (yRWrist - yRElbow) ** 2); // Elbow to Wrist
                        const rshouderToWristLength = Math.sqrt((xRWrist - xRightShoulder) ** 2 + (yRWrist - yRightShoulder) ** 2); // Shoulder to Wrist

                        // Use the Law of Cosines to calculate the angle at the elbow (keypoint 8)
                        const rcosTheta = (rhumerusLength ** 2 + rforearmLength ** 2 - rshouderToWristLength ** 2) / (2 * rhumerusLength * rforearmLength);
                        const rangleRadians = Math.acos(Math.max(-1, Math.min(1, rcosTheta))); // Clamp to avoid NaN
                        const rangleDegrees = (rangleRadians * 180) / Math.PI; // Convert to degrees

                        updateAngleRight(rangleDegrees);
                        if (rangleDegrees > 160 && !up) {  
                            updateUp(true);  // Starting position (arms fully extended)
                            updateDown(false); // Reset the down flag
                        }
                        
                        if (rangleDegrees < 90 && up && !down) { 
                            updateDown(true);  // Lowered to 90 degrees
                        }
                        
                        if (up && down) {  
                            repCounter(repCount + 1); // Count rep only when full motion is completed
                            updateUp(false);  // Reset
                            updateDown(false);
                        }

                        if (rangleDegrees < 70) {
                            updateRightFeedback('<70 degrees detected on Right Arm! Increase angle');
                        } else
                            updateRightFeedback('Right Arm CORRECT');

                    }
                    // Compute segment lengths for left arm
                    const humerusLength = Math.sqrt((xElbow - xLeftShoulder) ** 2 + (yElbow - yLeftShoulder) ** 2); // Shoulder to Elbow
                    const forearmLength = Math.sqrt((xWrist - xElbow) ** 2 + (yWrist - yElbow) ** 2); // Elbow to Wrist
                    const shouderToWristLength = Math.sqrt((xWrist - xLeftShoulder) ** 2 + (yWrist - yLeftShoulder) ** 2); // Shoulder to Wrist

                    // Use the Law of Cosines to calculate the angle at the elbow (keypoint 7)
                    const cosTheta = (humerusLength ** 2 + forearmLength ** 2 - shouderToWristLength ** 2) / (2 * humerusLength * forearmLength);
                    const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosTheta))); // Clamp to avoid NaN
                    const angleDegrees = (angleRadians * 180) / Math.PI; // Convert to degrees

                    updateAngle(angleDegrees);

                    if (exerciseName === "Curl") {
                        // Existing rep count logic for angle-based curl detection:
                        if (angleDegrees > 170 && !down) {  
                            updateDown(true);  // Arm is fully extended (bottom)
                            updateUp(false);   // Reset the up flag
                        }
                        
                        if (angleDegrees < 45 && down && !up) { 
                            updateUp(true);  // Arm is at the top
                        }
                        
                        if (down && up) {  
                            repCounter(repCount + 1); // Only count when completing full motion
                            updateDown(false);  // Reset
                            updateUp(false);
                        }
                    
                        // Extract left hip keypoint (keypoint 11) for torso approximation
                        const xLeftHip = Number(output[11 * 3 + 1]) * frameWidth;
                        const yLeftHip = Number(output[11 * 3]) * frameHeight;
                    
                        // Compute the shoulder-to-hip distance (used to scale the elbow threshold)
                        // distance of a line formula
                        const shoulderHipDistance = Math.sqrt(
                            (xLeftHip - xLeftShoulder) ** 2 +
                            (yLeftHip - yLeftShoulder) ** 2
                        );
                    
                        // Compute the perpendicular distance from the elbow to the line joining shoulder and hip
                        // perpendicular distance formula
                        const elbowDistance = Math.abs(
                            (xElbow - xLeftShoulder) * (yLeftHip - yLeftShoulder) -
                            (yElbow - yLeftShoulder) * (xLeftHip - xLeftShoulder)
                        ) / shoulderHipDistance;
                    
                        // Define a threshold (ratio towards the length of your shouler to hip)
                        const elbowThreshold = shoulderHipDistance * 0.25;
                    
                        // Separate checks for angle and elbow position
                        let feedbackMessage = '';
                    
                        if (angleDegrees < 35) {
                            feedbackMessage += '<35° DETECTED TOO TENSED! Increase angle. ';
                        }
                        if (elbowDistance > elbowThreshold) {
                            feedbackMessage += 'Elbow too far forward! Tuck elbows in.';
                        }
                        if (feedbackMessage === '') {
                            feedbackMessage = 'Correct Form';
                        }
                    
                        updateFeedback(feedbackMessage);
                    }

                    if (exerciseName === "Shoulder Press") {
                        if (angleDegrees < 70) {
                            updateFeedback('<70 degrees detected on Left Arm! Increase angle');
                        } else
                            updateFeedback('Left Arm CORRECT');
                    }

                }

                // Extract keypoints for LEFT arm ONLY
                // 6, 8, and 10 are the right arm (not required for only left bicep curl)
                const keypoints = [5, 7, 9]; // again here 5 = shoulder, 7 = elbow, and 9 = wrist
                if (exerciseName === "Shoulder Press") {
                    keypoints.push(6, 8, 10);
                }

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
                if (exerciseName === "Shoulder Press") {
                    armLines.push([6, 8], [8, 10]);
                }

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
            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Choose Exercise</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setDown(false);
                                setUp(false);
                                setRepCount(0);
                                setAngle(0)
                                setRightArmAngle(0)
                                handleSelectExercise('Curl')

                            }}
                        >
                            <Text style={styles.buttonText}>Bicep Curl</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setDown(false);
                                setUp(false);
                                setRepCount(0);
                                setAngle(0)
                                setRightArmAngle(0)
                                handleSelectExercise('Shoulder Press')

                            }}
                        >
                            <Text style={styles.buttonText}>Shoulder Press</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.overlay}>
                <Text style={styles.feedbackText}>Current Exercise: {exerciseName}</Text>
            </View>

            <View style={styles.overlay}>
                <Text
                    style={[
                        styles.feedbackText,
                        // Apply red style when:
                        // - For Curl: feedback contains '<35 degrees'
                        // - For Shoulder Press: feedback contains '<70 degrees'
                        (exerciseName === "Curl" && (feedback.includes('<35°') || feedback.includes('Elbow'))) ||
                            (exerciseName === "Shoulder Press" && feedback.includes('<70 degrees'))
                            ? styles.incorrectFeedback
                            : styles.correctFeedback,
                    ]}
                >
                    {feedback} ~ {angle !== null ? `${Math.round(angle)}°\n` : 'Loading...'}
                    {exerciseName === "Shoulder Press" && (
                        <Text
                            style={[
                                styles.feedbackText,
                                rFeedback.includes('<70 degrees')
                                    ? styles.incorrectFeedback
                                    : styles.correctFeedback,
                            ]}
                        >
                            {rFeedback} ~ {rightArmAngle !== null ? `${Math.round(rightArmAngle)}°` : 'Loading...'}
                        </Text>

                    )}

                    <Text>Reps: {repCount}</Text>
                </Text>
            </View>


            {/* Instruction Overlay */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Keep your back straight and fully extend your arms!
                </Text>
                <TouchableOpacity style={styles.changeExercise} onPress={() => { setIsModalVisible(true); setExerciseName("") }}>
                    <Text style={styles.instructionText}>Change Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.changeExercise} onPress={() => {
                    if (start) {
                        setStart(false)
                        setAngle(0)
                        setRightArmAngle(0)
                        setRepCount(0)
                    }
                    else {
                        setStart(true)
                        setAngle(0)
                        setRightArmAngle(0)
                        setRepCount(0)
                    }


                }}>
                    <Text style={styles.instructionText}>{start ? "Stop" : "Start"}</Text>
                </TouchableOpacity>
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
    changeExercise: {
        backgroundColor: 'red',
        width: 200,
        marginLeft: 90,
        marginTop: 10,
        borderRadius: 10,
    },
    feedbackText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        marginBottom: 20,
    },

    correctFeedback: {
        color: 'green', // Green text for correct form
    },

    incorrectFeedback: {
        color: 'red', // Red text for incorrect form
    },

    overlay: {
        display: 'flex',
        flexDirection: 'column',
        gap: 200,
        position: 'absolute',
        top: '10%', // 👈 Increase this value if text is not visible
        left: '10%',
        right: '10%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        padding: 15,
        borderRadius: 8,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: 'red',
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 8,
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