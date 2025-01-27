import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import useWorkoutPlan from "../../hooks/WorkoutPlanContext";
import { ImageMap } from "../ExcerciseData";
import { useRouter } from "expo-router";
import { WorkoutParameters } from "../types/PlanTypes";
import Routine from "../Routine";

export default function UpdateExercisePage() {
    const { setChosenExercise, chosenExercise, setRoutines, setActiveRoutine, activeRoutine } = useWorkoutPlan();
    const [workoutParameters, setWorkoutParameters] = useState<WorkoutParameters>({
        sets: chosenExercise?.getSets() ?? null,
        reps: chosenExercise?.getReps() ?? null,
        restTime: chosenExercise?.getRestTime() ?? null,
        weight: chosenExercise?.getWeight() ?? null,
    });
    const router = useRouter();

    const handleUpdate = () => {
        if (chosenExercise && activeRoutine) {
            let updatedExercise = chosenExercise.updateExercise(workoutParameters);

            let updatedActiveRoutineExercise = activeRoutine
                .getExercises()
                .map((exercise) =>
                    updatedExercise.getName() === exercise.getName() ? updatedExercise : exercise
                );

            let newActiveRoutine = new Routine(
                activeRoutine.getName(),
                updatedActiveRoutineExercise
            );

            setActiveRoutine(newActiveRoutine); // Update the active routine
            setRoutines((prevRoutines) =>
                prevRoutines.map((routine) =>
                    routine.getName() === activeRoutine.getName() ? newActiveRoutine : routine
                )
            );

            setChosenExercise(updatedExercise); // Update the chosen exercise
        }
    };

    function handleDiscardExercise() {
        if (activeRoutine && chosenExercise) {
            let updatedActiveRoutine = activeRoutine.removeExercise(chosenExercise)
            setActiveRoutine(updatedActiveRoutine)
            setRoutines((prevRoutines) =>
                prevRoutines.map((routine) =>
                    routine.getName() === activeRoutine.getName() ? updatedActiveRoutine : routine
                )
            );
            router.replace("/(tabs)/WorkoutPlan")
        }
    }

    function handleComplete() {
        if (chosenExercise && activeRoutine) {
            let newExercise = chosenExercise.setCompleted(true)
            let updatedActiveRoutineExercise = activeRoutine
                .getExercises()
                .map((exercise) =>
                    newExercise.getName() === exercise.getName() ? newExercise : exercise
                );
            let newActiveRoutine = new Routine(activeRoutine.getName(), updatedActiveRoutineExercise)
            setRoutines((prevRoutines) =>
                prevRoutines.map((routine) =>
                    routine.getName() === activeRoutine.getName() ? newActiveRoutine : routine
                )
            );

            setChosenExercise(newExercise);
            router.replace("/(tabs)/WorkoutPlan")
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{chosenExercise?.getName()}</Text>
            </View>

            <Image
                source={ImageMap[chosenExercise ? chosenExercise.getUrl() : "../../assets/images/workout/benchPress.jpg"]}
                style={styles.exerciseImage}
            />

            <Text style={styles.description}>{chosenExercise?.getDescription()}</Text>

            <View style={styles.inputContainer}>
                <View style={styles.inputFieldContainer}>
                    <Text style={styles.inputLabel}>Number of Sets</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(workoutParameters.sets ?? '')}
                        onChangeText={(text) =>
                            setWorkoutParameters((prev) => ({ ...prev, sets: Number(text) }))
                        }
                    />
                </View>
                <View style={styles.inputFieldContainer}>
                    <Text style={styles.inputLabel}>Number of Reps</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(workoutParameters.reps ?? '')}
                        onChangeText={(text) =>
                            setWorkoutParameters((prev) => ({ ...prev, reps: Number(text) }))
                        }
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.inputFieldContainer}>
                    <Text style={styles.inputLabel}>Rest Time</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(workoutParameters.restTime ?? '')}
                        onChangeText={(text) =>
                            setWorkoutParameters((prev) => ({ ...prev, restTime: Number(text) }))
                        }
                    />
                </View>
                <View style={styles.inputFieldContainer}>
                    <Text style={styles.inputLabel}>Weight (lb)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(workoutParameters.weight ?? '')}
                        onChangeText={(text) =>
                            setWorkoutParameters((prev) => ({ ...prev, weight: Number(text) }))
                        }
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.replace("/(tabs)/WorkoutPlan")} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>Update Exercise</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleDiscardExercise} style={styles.discardButton}>
                    <Text style={styles.discardButtonText}>Discard Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Complete Exercise</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2A2424",
        padding: 16,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    exerciseImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    description: {
        color: "white",
        fontSize: 16,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    inputFieldContainer: {
        flex: 1,
        marginHorizontal: 8,
    },
    inputLabel: {
        color: "white",
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#1E1E1E",
        color: "white",
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#444",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    backButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
    },
    backButtonText: {
        color: "#F50707",
        fontWeight: "bold",
    },
    updateButton: {
        flex: 1,
        backgroundColor: "#F50707",
        paddingVertical: 12,
        borderRadius: 4,
        marginLeft: 8,
        alignItems: "center",
    },
    updateButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    discardButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        borderRadius: 4,
        marginRight: 8,
        alignItems: "center",
    },
    discardButtonText: {
        color: "#F50707",
        fontWeight: "bold",
    },
    completeButton: {
        flex: 1,
        backgroundColor: "#F50707",
        paddingVertical: 12,
        borderRadius: 4,
        marginLeft: 8,
        alignItems: "center",
    },
    completeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
