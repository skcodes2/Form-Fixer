import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ExerciseDataType } from '../../../types/PlanTypes';
import { ImageMap } from '../ExcerciseData';

type ExerciseProps = {
    exerciseData: ExerciseDataType;
    addExercise: () => void;
};

export default function Exercise({ exerciseData, addExercise }: ExerciseProps) {
    return (
        <View style={styles.container}>
            <Image source={ImageMap[exerciseData.url]} style={styles.image} />

            <Text style={styles.name}>{exerciseData.name}</Text>

            <TouchableOpacity onPress={addExercise} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000', // Black background
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25, // Circular image
        marginRight: 10,
    },
    name: {
        flex: 1,
        color: '#FFF', // White text
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#F50707', // Red background for Add button
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    addButtonText: {
        color: '#FFF', // White text
        fontWeight: 'bold',
    },
});
