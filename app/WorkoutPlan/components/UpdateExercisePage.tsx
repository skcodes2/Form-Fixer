import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import useWorkoutPlan from "../../hooks/WorkoutPlanContext";
import { ImageMap } from "../ExcerciseData";
import { useRouter } from "expo-router";
import { WorkoutParameters } from "../types/PlanTypes";
import Routine from "../Routine";
import Plan from "../Plan";

export default function UpdateExercisePage() {
    const { setChosenExercise, chosenExercise, setRoutines, setActiveRoutine, activeRoutine, setWorkoutPlans, activePlan } = useWorkoutPlan();
    const [workoutParameters, setWorkoutParameters] = useState<WorkoutParameters>({
        sets: chosenExercise?.getSets() ?? null,
        reps: chosenExercise?.getReps() ?? null,
        restTime: chosenExercise?.getRestTime() ?? null,
        weight: chosenExercise?.getWeight() ?? null,
    });
    const router = useRouter();

    const updateWorkoutPlans = (newRoutine: Routine) => {
        setWorkoutPlans(prevPlans =>
            prevPlans.map(plan =>
                plan.getName() === activePlan.getName() ?
                    new Plan(plan.getName(), [...plan.getRoutines(), newRoutine]) :
                    plan
            )
        );
    };

    // Utility function to update the routine list
    const updateRoutineList = (updatedRoutine: Routine) => {
        setActiveRoutine(updatedRoutine);
        setRoutines(prevRoutines =>
            prevRoutines.map(routine => (routine.getName() === activeRoutine?.getName() ? updatedRoutine : routine))
        );
    };

    // Handles exercise update
    const handleUpdate = () => {
        if (!chosenExercise || !activeRoutine) return;
        const updatedExercise = chosenExercise.updateExercise(workoutParameters);
        const updatedRoutine = new Routine(
            activeRoutine.getName(),
            activeRoutine.getExercises().map(exercise =>
                updatedExercise.getName() === exercise.getName() ? updatedExercise : exercise
            )
        );
        updateRoutineList(updatedRoutine);
        updateWorkoutPlans(updatedRoutine)
        setChosenExercise(updatedExercise);
    };

    // Handles exercise removal
    const handleDiscardExercise = () => {
        if (!chosenExercise || !activeRoutine) return;
        const updatedRoutine = activeRoutine.removeExercise(chosenExercise);
        updateRoutineList(updatedRoutine);
        updateWorkoutPlans(updatedRoutine)
        router.replace("/(tabs)/WorkoutPlan");
    };

    // Handles exercise completion
    const handleComplete = () => {
        if (!chosenExercise || !activeRoutine) return;
        const updatedExercise = chosenExercise.setCompleted(true);
        const updatedRoutine = new Routine(activeRoutine.getName(), [
            ...activeRoutine.getExercises().filter(exercise => exercise.getName() !== updatedExercise.getName()),
            updatedExercise, // Move updated exercise to the end
        ]);
        updateRoutineList(updatedRoutine);
        updateWorkoutPlans(updatedRoutine)
        setChosenExercise(updatedExercise);
        router.replace("/(tabs)/WorkoutPlan");
    };

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
                {(["sets", "reps"] as (keyof WorkoutParameters)[]).map((key, index) => (
                    <View key={index} style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>{key === "sets" ? "Number of Sets" : "Number of Reps"}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(workoutParameters[key] ?? '')}
                            onChangeText={text => setWorkoutParameters(prev => ({ ...prev, [key]: Number(text) }))}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.inputContainer}>
                {(["restTime", "weight"] as (keyof WorkoutParameters)[]).map((key, index) => (
                    <View key={index} style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>
                            {key === "restTime" ? "Rest Time" : "Weight (lb)"}
                        </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(workoutParameters[key] ?? '')}
                            onChangeText={text => setWorkoutParameters(prev => ({ ...prev, [key]: Number(text) }))}
                        />
                    </View>
                ))}
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

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2A2424",
        padding: 16,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 16,
        marginTop: 25,
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
