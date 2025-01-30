import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';

interface RoutineButtonProps {
    name: string;
    onClose: () => void;
    onPress: () => void;
    isActive: boolean;
}

export default function RoutineButton({ name, onClose, onPress, isActive }: RoutineButtonProps) {


    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.RoutineButton,
                isActive && styles.activeRoutineButton,
            ]}
        >
            <View style={styles.buttonContainer}>
                <Text
                    style={[
                        styles.routineText,
                        isActive && styles.activeRoutineText,
                    ]}
                >
                    {name}
                </Text>

                <View style={styles.closeButtonWrapper}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text
                            style={[
                                styles.xButton,
                                isActive && styles.activeXButton,
                            ]}
                        >
                            ✖
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    RoutineButton: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#F50707',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: 'center',
        marginRight: 5,
    },
    activeRoutineButton: {
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routineText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    activeRoutineText: {
        color: '#F50707',
    },
    closeButtonWrapper: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'transparent',
        width: 20,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    xButton: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    activeXButton: {
        color: 'black',
    },
});
