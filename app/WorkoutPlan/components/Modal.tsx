
import { MaterialIcons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Pressable,
} from 'react-native';
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];


type CustomModalProps = {
    title: string;
    inputPlaceholder: any[];
    icon: MaterialIconName[];
    handleConfirm: () => void;
    handleBack?: () => void;
    isModalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function CustomModal({
    title,
    inputPlaceholder,
    icon,
    handleConfirm,
    handleBack,
    isModalVisible,
    setModalVisible,
    data,
    setData,
}: CustomModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >

            <Pressable
                style={styles.modalBackground}
                onPress={() => setModalVisible(false)} // Close modal on background press
            >
                <Pressable style={styles.modalContainer} onPress={() => { }}>
                    <Text style={styles.modalTitle}>{title}</Text>


                    {inputPlaceholder.map((placeholder, index) => (
                        <View key={index} style={styles.inputContainer}>
                            <MaterialIcons
                                name={icon[index]}
                                size={24}
                                color="white"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={placeholder}
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={Array.isArray(data) ? data[index] : data}
                                onChangeText={(text) => {
                                    if (inputPlaceholder.length === 1) {
                                        setData(text);
                                    } else {
                                        setData((prev: any) => {
                                            const newData = [...prev];
                                            newData[index] = text;
                                            return newData;
                                        });
                                    }
                                }}
                            />
                        </View>
                    ))}


                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                handleBack && handleBack();
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                                setModalVisible(false);
                                handleConfirm();
                            }}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'black',
        width: '80%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'white',
        width: '100%',
        marginBottom: 16, // Add spacing between inputs
        paddingBottom: 8,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 16,
    },
    confirmButton: {
        backgroundColor: '#F50707',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    backButtonText: {
        color: '#F50707',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
