import React, { useEffect, useMemo, useState } from 'react';
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


// Helper function to convert tensors to string
function tensorToString(tensor: TensorflowModel['inputs'][number]): string {
    return `${tensor.dataType} [${tensor.shape}]`;
}

const LINE_WIDTH = 2;
const MIN_CONFIDENCE = 0.3;
const VIEW_WIDTH = Dimensions.get('screen').width;

function Video(): JSX.Element {
    const device = useCameraDevice('back'); // Use back camera by default
    const { hasPermission, requestPermission } = useCameraPermission(); // Camera permissions logic
    const [position, setPosition] = useState<'back' | 'front'>('back');
    const { resize } = useResizePlugin();
    const [isRecording, setIsRecording] = useState(false);

    function startScreenRecording() {

    }
    function stopScreenRecording() {

    }


    const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
    const plugin = useTensorflowModel(
        require('./poseModel.tflite'),
        delegate,
    );

    const format = useMemo(
        () => (device != null ? getBestFormat(device, 720, 1000) : undefined),
        [device],
    );

    const pixelFormat = Platform.OS === 'ios' ? 'rgb' : 'yuv';

    useEffect(() => {
        const model = plugin.model;
        if (model == null) {
            return;
        }
        console.log(
            `Model: ${model.inputs.map(tensorToString)} -> ${model.outputs.map(
                tensorToString,
            )}`,
        );
    }, [plugin]);

    const inputTensor = plugin.model?.inputs[0];
    const inputWidth = inputTensor?.shape[1] ?? 0;
    const inputHeight = inputTensor?.shape[2] ?? 0;

    // to get from px -> dp since we draw in the camera coordinate system
    const SCALE = (format?.videoWidth ?? VIEW_WIDTH) / VIEW_WIDTH;

    const paint = Skia.Paint();
    paint.setStyle(PaintStyle.Fill);
    paint.setStrokeWidth(LINE_WIDTH * SCALE);
    paint.setColor(Skia.Color('white'));

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



    const rotation = Platform.OS === 'ios' ? '0deg' : '0deg'; // hack to get android oriented properly

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
                    rotation: rotation,
                });
                const outputs = plugin.model.runSync([smaller]);

                const output = outputs[0];
                const frameWidth = frame.width;
                const frameHeight = frame.height;


                let lengthOfLines = []
                for (let i = 0; i < lines.length; i += 2) {
                    const from = lines[i];
                    const to = lines[i + 1];

                    const confidence = output[from * 3 + 2];
                    if (confidence > MIN_CONFIDENCE) {
                        let y1 = Number(output[from * 3]) * Number(frameHeight);
                        let y2 = Number(output[to * 3]) * Number(frameHeight);
                        let x1 = Number(output[from * 3 + 1]) * Number(frameWidth)
                        let x2 = Number(output[to * 3 + 1]) * Number(frameWidth)
                        // Reduce the height of specific lines
                        let length = Math.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)
                        lengthOfLines.push(length)
                        if (lengthOfLines.length >= lines.length) {
                            lengthOfLines = []
                        }
                        console.log(lengthOfLines)

                        frame.drawLine(
                            x1, // x1
                            y1, // Adjusted y1
                            x2, // x2
                            y2, // Adjusted y2
                            paint,
                        );
                    }
                }
            }

        },
        [plugin, paint],
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
                pixelFormat={pixelFormat}
            />

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
    link: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    rec_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    rec_heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    rec_button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    rec_buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Video;
