import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import CustomModal from 'app/WorkoutPlan/components/Modal';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import RoutineButton from '../WorkoutPlan/components/RoutineButton';
import Routine from '../WorkoutPlan/Routine';
import useWorkoutPlan from 'app/hooks/WorkoutPlanContext';
import ChosenExercise from 'app/WorkoutPlan/components/ChosenExercise';
import Plan from 'app/WorkoutPlan/Plan';
import useUser from '../hooks/UserContext';
import AuthPut from '../../Fetchers/Auth/AuthPut';
import AuthGet from '../../Fetchers/Auth/AuthGet';
import { host } from '../index';
import Exercise from 'app/WorkoutPlan/Exercise';
import { ExerciseDataType, WorkoutParameters } from '../../types/PlanTypes';

const WorkoutPlan = () => {
    const { temporyPlansFetched, setTemporyPlansFetched, workoutPlanFetched, setWorkoutPlanFetched, fetched, setFetched, defaultPlan, activeRoutine, setActiveRoutine, routines, setRoutines, workoutPlans, setWorkoutPlans, setActivePlan, activePlan } = useWorkoutPlan();
    const [dropdownValue, setDropdownValue] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('');
    const router = useRouter();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isAddPlanVisible, setAddPlanVisible] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [isRenameModelVisible, setRenameModelVisible] = useState(false);
    const { user, token, setUser } = useUser();
    const [hasPlan, setHasPlan] = useState(user?.hasPlan);
    const [temporyPlans, setTemporyPlans] = useState<{ name: string, routines: any[] }[] | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    console.log(fetched)


    const updateRoutineList = (updatedRoutine: Routine) => {
        setRoutines(prevRoutines =>
            prevRoutines.map(routine =>
                routine.getName() === activeRoutine?.getName() ? updatedRoutine : routine
            )
        );
    };

    const updateWorkoutPlans = (newRoutine: Routine) => {
        setWorkoutPlans(prevPlans => {
            let plans = prevPlans.map(plan =>
                plan.getName() === dropdownValue ?
                    new Plan(plan.getName(), [...plan.getRoutines().filter(routine => routine.getName() != newRoutine.getName()), newRoutine]) :
                    plan
            )
            AuthPut(host + "/workouts/update-workout", { newPlan: plans }, () => { }, token)
            return plans
        }
        );

    };

    const handleRemoveAll = () => {
        if (!activeRoutine) return;
        const updatedRoutine = activeRoutine.removeAllExercises();
        setActiveRoutine(updatedRoutine);
        updateRoutineList(updatedRoutine);
        updateWorkoutPlans(updatedRoutine);
    };

    const handleAddRoutine = () => {
        if (!newRoutineName.trim()) {
            setModalVisible(true);
            alert('Please enter a routine name.');
            return;
        }

        const newRoutine = new Routine(newRoutineName, null);
        const updatedRoutines = [...routines, newRoutine];

        setRoutines(updatedRoutines);
        updateWorkoutPlans(newRoutine);
        setNewRoutineName('');
    };

    const handleReset = () => {
        if (!activeRoutine) return;
        const updatedRoutine = activeRoutine.resetCompleteness();
        setActiveRoutine(updatedRoutine);
        updateRoutineList(updatedRoutine);
        updateWorkoutPlans(updatedRoutine);
    };

    const deleteCurrentPlan = () => {
        if (workoutPlans.length === 1) {
            return alert('Cannot delete the last plan');
        }
        const updatedPlans = workoutPlans.filter(plan => plan.getName() !== dropdownValue);
        AuthPut(host + "/workouts/update-workout", { newPlan: updatedPlans }, () => { }, token)
        setWorkoutPlans(updatedPlans);
        setDropdownValue(updatedPlans[0].getName());
        setRoutines(updatedPlans[0].getRoutines());
        setActivePlan(updatedPlans[0]);
        setActiveRoutine(updatedPlans[0].getRoutines()[0]);
        setMenuVisible(false);
    };

    const handleAddPlan = () => {
        if (!newPlanName.trim()) {
            setAddPlanVisible(true);
            alert('Please enter a plan name.');
            return;
        }

        const newPlan = new Plan(newPlanName, [new Routine('Routine 1', null)]);
        const updatedPlans = [...workoutPlans, newPlan];
        AuthPut(host + "/workouts/update-workout", { newPlan: updatedPlans }, () => { }, token)

        setWorkoutPlans(updatedPlans);
        setDropdownValue(newPlanName);
        setRoutines(newPlan.getRoutines());
        setActiveRoutine(newPlan.getRoutines()[0]);
        setActivePlan(newPlan);
        setNewPlanName('');
        setMenuVisible(false);
        setNewPlanName('');
    };

    const handleRenamePlan = () => {
        if (!newPlanName.trim()) {
            setRenameModelVisible(true);
            alert('Please enter a plan name.');
            return;
        }

        const updatedPlans = workoutPlans.map(plan => (
            plan.getName() === dropdownValue ? new Plan(newPlanName, plan.getRoutines()) : plan
        ));

        setWorkoutPlans(updatedPlans);
        AuthPut(host + "/workouts/update-workout", { newPlan: updatedPlans }, () => { }, token)
        setDropdownValue(newPlanName);
        const newActivePlan = updatedPlans.find(plan => plan.getName() === newPlanName);
        if (newActivePlan) {
            setActivePlan(newActivePlan);
        }
        setRenameModelVisible(false);
        setNewPlanName('');
    };

    useEffect(() => {

        if (fetched) setLoading(false);
        if (!fetched) {
            if (!hasPlan) {
                AuthPut(host + '/workouts/create-workout', { newPlan: defaultPlan }, () => { }, token);
                AuthPut(host + '/users/update-plan', { hasPlan: true }, () => { }, token);
                setDropdownValue(defaultPlan[0].getName());
                setRoutines(defaultPlan[0].getRoutines());
                setHasPlan(true);
                console.log("called1")
                if (user)
                    setUser({ ...user, hasPlan: true });
            }
            else if (token)
                AuthGet(host + '/workouts/get-workout', setTemporyPlans, () => { }, token);
            setFetched(true);
        }
    }, []);

    useEffect(() => {
        if (!temporyPlansFetched && temporyPlans) {
            console.log("called2")
            let plans: Plan[] = [];
            temporyPlans.forEach(plan => {
                let routinesT: Routine[] = [];
                if (plan.routines[0].exercises[0]) {
                    plan.routines.forEach(routine => {
                        let exercises: Exercise[] = [];
                        routine.exercises.forEach((exercise: any) => {
                            let parameters: WorkoutParameters = { sets: exercise.sets, reps: exercise.reps, weight: exercise.weight, restTime: exercise.restTime };
                            let exerciseData: ExerciseDataType = { name: exercise.name, url: exercise.url, timePerRep: exercise.timePerRep, description: exercise.description };
                            exercises.push(new Exercise(exerciseData, parameters, exercise.exerciseType, exercise.isCompleted));
                        });
                        routinesT.push(new Routine(routine.name, exercises));
                    });
                } else {
                    plan.routines.forEach(routine => {
                        routinesT.push(new Routine(routine.name, null));
                    });
                }
                plans.push(new Plan(plan.name, routinesT));
            });
            setWorkoutPlanFetched(true);
            setTemporyPlansFetched(true);
            setWorkoutPlans(plans);
        }
    }, [temporyPlans]);

    useEffect(() => {
        if (workoutPlans && workoutPlans.length > 0 && fetched && workoutPlanFetched) {
            setDropdownValue(workoutPlans[0].getName());
            setRoutines(workoutPlans[0].getRoutines());
            setActiveRoutine(workoutPlans[0].getRoutines()[0]);
            setActivePlan(workoutPlans[0]);
            setWorkoutPlanFetched(false);
            setLoading(false); // Set loading to false after data is fetched
            console.log("called3")

        }
    }, [workoutPlans]);

    if (loading && !fetched) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F50707" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {workoutPlans[0] instanceof Plan && <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={workoutPlans.map(plan => ({ label: plan.getName(), value: plan.getName() }))}
                    activeColor="#F50707"
                    itemTextStyle={{ color: 'white' }}
                    labelField="label"
                    valueField="value"
                    placeholder="Your Workout Plan"
                    value={activePlan.getName()}
                    onChange={(item) => {
                        const selectedPlan = workoutPlans.find(plan => plan.getName() === item.value);
                        if (selectedPlan) {
                            setDropdownValue(item.value); // Update dropdown selection
                            setRoutines(selectedPlan.getRoutines());
                            setActiveRoutine(selectedPlan.getRoutines()[0]);
                            setActivePlan(selectedPlan);
                        }
                    }}
                    renderLeftIcon={() => (
                        <MaterialIcons name="access-time" size={24} color="white" style={styles.clockIcon} />
                    )}
                />}
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
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
            <CustomModal
                title="Rename Plan"
                inputPlaceholder={["Plan Name"]}
                icon={["calendar-today"]}
                handleConfirm={handleRenamePlan}
                isModalVisible={isRenameModelVisible}
                setModalVisible={setRenameModelVisible}
                data={newPlanName}
                setData={setNewPlanName}
                inputTypes={['ascii-capable']}
            />
            <CustomModal
                title="New Plan"
                inputPlaceholder={["Plan Name"]}
                icon={["calendar-today"]}
                handleConfirm={handleAddPlan}
                isModalVisible={isAddPlanVisible}
                setModalVisible={setAddPlanVisible}
                data={newPlanName}
                setData={setNewPlanName}
                inputTypes={['ascii-capable']}
            />

            <Modal transparent visible={isMenuVisible} animationType="fade">
                <Pressable style={styles.modalBackground} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setRenameModelVisible(true)}>
                            <Text style={styles.menuText}>Rename</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => setAddPlanVisible(true)}>
                            <Text style={styles.menuText}>Add Workout Plan</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.menuItem} onPress={deleteCurrentPlan}>
                            <Text style={styles.menuText}>Delete Current Plan</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <View style={styles.routinesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routineScroll}>
                    {routines[0] instanceof Routine && routines.map((routine, index) => (
                        <RoutineButton
                            key={index}
                            name={routine.getName()}
                            onClose={() => {
                                if (routines.length === 1) {
                                    return alert('Cannot delete the last routine');
                                }
                                let newRoutines = routines.filter((ele) => ele !== routine)
                                let newPlan = new Plan(activePlan.getName(), newRoutines)
                                console.log(newPlan)
                                let updatedPlans = workoutPlans.map(plan => plan.getName() === activePlan.getName() ? newPlan : plan)
                                console.log(updatedPlans)
                                AuthPut(host + "/workouts/update-workout", { newPlan: updatedPlans }, () => { }, token)
                                setWorkoutPlans(updatedPlans)
                                setRoutines(newRoutines);
                                if (activeRoutine?.getName() === routine.getName()) setActiveRoutine(null);

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
                <Text style={styles.totalText}>Total of {workoutPlans[0].getRoutines()[0] instanceof Routine && activeRoutine?.getExercises().length} Exercises | {workoutPlans[0].getRoutines()[0] instanceof Routine && activeRoutine?.getTotalRoutineTime()} min</Text>
                <TouchableOpacity onPress={() => { router.replace("../WorkoutPlan/components/ExercisePage") }} style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>+ Add Exercise</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={styles.exerciseList}>
                {workoutPlans[0].getRoutines()[0] instanceof Routine && activeRoutine?.getExercises().map((exercise, index) => (
                    <ChosenExercise key={index} exercise={exercise} />
                ))}
            </ScrollView>


            <View style={styles.footer}>
                <TouchableOpacity onPress={handleRemoveAll} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Remove All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Reset</Text>
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: 'black',
        width: 200,
        padding: 10,
        borderRadius: 10,
    },
    menuItem: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    menuText: {
        color: 'white',
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: 'white',
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2A2424',
    },
});

export default WorkoutPlan;
