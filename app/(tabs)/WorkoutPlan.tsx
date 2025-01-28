import React, { act, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import CustomModal from 'app/WorkoutPlan/components/Modal';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import RoutineButton from '../WorkoutPlan/components/RoutineButton';
import Routine from '../WorkoutPlan/Routine';
import useWorkoutPlan from 'app/hooks/WorkoutPlanContext';
import ChosenExercise from 'app/WorkoutPlan/components/ChosenExercise';

const WorkoutPlan = () => {
    const [dropdownValue, setDropdownValue] = useState(null);
    const { activeRoutine, setActiveRoutine, routines, setRoutines } = useWorkoutPlan()
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('');
    const router = useRouter();
    const dropdownData = [
        { label: 'Edit Routine', value: 'edit' },
        { label: 'Delete Routine', value: 'delete' },
        { label: 'Share Routine', value: 'share' },
    ];

    const handleAddRoutine = () => {
        if (newRoutineName.trim()) {
            setRoutines([...routines, new Routine(newRoutineName, null)]);
            setNewRoutineName('');
        } else {
            setModalVisible(true)
            alert('Please enter a routine name.');
        }
    };

    function handleRemoveAll() {
        if (activeRoutine) {
            let removedRoutineExercises = activeRoutine.removeAllExercises()
            setActiveRoutine(removedRoutineExercises);
            setRoutines((prevRoutines) =>
                prevRoutines.map((routine) =>
                    routine.getName() === activeRoutine.getName() ? removedRoutineExercises : routine
                )
            );
        } else {
            setActiveRoutine(null); // Fallback if activeRoutine is undefined
        }
    }

    function handleReset() {
        if (activeRoutine) {
            let newActiveRoutine = activeRoutine?.resetCompleteness()
            setActiveRoutine(newActiveRoutine)
            setRoutines(prevRoutines => (
                prevRoutines.map(routine => (
                    newActiveRoutine.getName() === routine.getName() ? newActiveRoutine : routine
                ))
            ))
        }

    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={dropdownData}
                    activeColor="#F50707"
                    itemTextStyle={{ color: 'white' }}
                    labelField="label"
                    valueField="value"
                    placeholder="Your Workout Plan"
                    value={dropdownValue}
                    onChange={(item) => setDropdownValue(item.value)}
                    renderLeftIcon={() => (
                        <MaterialIcons name="access-time" size={24} color="white" style={styles.clockIcon} />
                    )}
                />
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuDots}>⋮</Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                title="New Routine"
                inputPlaceholder={["Routine Name"]}
                icon={["access-time"]}
                handleConfirm={handleAddRoutine}
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                data={newRoutineName}
                setData={setNewRoutineName}
                inputTypes={['ascii-capable']}
            />

            <View style={styles.routinesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routineScroll}>
                    {routines.map((routine, index) => (
                        <RoutineButton
                            key={index}
                            name={routine.getName()}
                            onClose={() => {
                                if (routines.length === 1) {
                                    return alert('Cannot delete the last routine');
                                }
                                setRoutines(routines.filter((ele) => ele !== routine));
                                if (activeRoutine?.getName() === routine.getName()) setActiveRoutine(null); // Reset active if deleted
                            }}
                            onPress={() => setActiveRoutine(routine)} // Set active routine
                            isActive={activeRoutine?.getName() === routine.getName()} // Pass active state
                        />
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.newRoutineButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.newRoutineText}>New Routine</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.totalInfo}>
                <Text style={styles.totalText}>Total of {activeRoutine?.getExercises().length} Exercises | {activeRoutine?.getTotalRoutineTime()} min</Text>
                <TouchableOpacity onPress={() => router.replace("../WorkoutPlan/components/ExercisePage")} style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>+ Add Exercise</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={styles.exerciseList}>
                {activeRoutine?.getExercises().map((exercise, index) => (
                    <ChosenExercise key={index} exercise={exercise} />
                ))}
            </ScrollView>


            <View style={styles.footer}>
                <TouchableOpacity onPress={handleRemoveAll} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Remove All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Rest</Text>
                </TouchableOpacity>
            </View>



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A2424',
        flexDirection: 'column',
        padding: 13,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        paddingBottom: 8,
    },
    clockIcon: {
        marginRight: 8,
    },
    dropdown: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingHorizontal: 12,
        width: '90%',
        height: 50,
    },
    menuButton: {
        padding: 12,

    },
    menuDots: {
        color: 'white',
        fontSize: 28,

    },
    dropdownContainer: {
        backgroundColor: 'black',
        borderRadius: 8,
    },
    dropdownPlaceholder: {
        color: 'white',
        fontSize: 16,
    },
    dropdownSelectedText: {
        color: 'white',
        fontSize: 16,
    },
    routinesContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8,
        borderRadius: 8,
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderColor: 'white',
    },
    newRoutineButton: {
        backgroundColor: '#F50707',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    newRoutineText: {
        color: 'white',
        fontWeight: 'bold',
    },
    totalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalText: {
        color: 'white',
        fontSize: 16,
    },
    addExerciseButton: {
        backgroundColor: '#F50707',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    addExerciseText: {
        color: 'white',
        fontWeight: 'bold',
    },
    exerciseList: {
        flex: 1,
        marginBottom: 16,
    },
    exerciseCard: {
        backgroundColor: '#F50707',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    placeholderText: {
        color: 'white',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerButton: {
        backgroundColor: '#F50707',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'white',
        width: '100%',
        paddingBottom: 8,
        marginBottom: 16,
    },
    input: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },

    routineScroll: {
        flexDirection: 'row',
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
    },
    addedExercise: {
        backgroundColor: '#444',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
    },
    addedExerciseText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addedExerciseDetails: {
        color: 'white',
        fontSize: 14,
    },
});

export default WorkoutPlan;
