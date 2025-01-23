import React, { act, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Pressable,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import RoutineButton from '../WorkoutPlan/components/RoutineButton';

const WorkoutPlan = () => {
    const [dropdownValue, setDropdownValue] = useState(null);
    const [routines, setRoutines] = useState(['Routine 1', 'Routine 2', 'Routine 3', 'Routine 4']);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('');
    const [activeRoutine, setActiveRoutine] = useState<string | null>(null)
    const dropdownData = [
        { label: 'Edit Routine', value: 'edit' },
        { label: 'Delete Routine', value: 'delete' },
        { label: 'Share Routine', value: 'share' },
    ];

    const handleAddRoutine = () => {
        if (newRoutineName.trim()) {
            setRoutines([...routines, newRoutineName.trim()]);
            setNewRoutineName('');
            setModalVisible(false);
        } else {
            alert('Please enter a routine name.');
        }
    };

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


            <View style={styles.routinesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routineScroll}>
                    {routines.map((routine, index) => (
                        <RoutineButton
                            key={index}
                            name={routine}
                            onClose={() => {
                                if (routines.length === 1) {
                                    return alert('Cannot delete the last routine');
                                }
                                setRoutines(routines.filter((ele) => ele !== routine));
                                if (activeRoutine === routine) setActiveRoutine(null); // Reset active if deleted
                            }}
                            onPress={() => setActiveRoutine(routine)} // Set active routine
                            isActive={activeRoutine === routine} // Pass active state
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
                <Text style={styles.totalText}>Total of {routines.length} | 64mins</Text>
                <View style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>+ Add Exercise</Text>
                </View>
            </View>

            {/* Exercise List */}
            <ScrollView style={styles.exerciseList}>
                <View style={styles.exerciseCard}>
                    <Text style={styles.placeholderText}>Custom Exercise Component</Text>
                </View>
                <View style={styles.exerciseCard}>
                    <Text style={styles.placeholderText}>Custom Exercise Component</Text>
                </View>
            </ScrollView>


            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Remove All</Text>
                </View>
                <View style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Rest</Text>
                </View>
            </View>


            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Routine</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="access-time" size={24} color="white" />
                            <TextInput
                                style={styles.input}
                                placeholder="Routine Name"
                                placeholderTextColor="#ccc"
                                value={newRoutineName}
                                onChangeText={setNewRoutineName}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.addRoutineButton}
                            onPress={handleAddRoutine}
                        >
                            <Text style={styles.addRoutineButtonText}>Add Routine</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
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
        paddingBottom: 8,
        marginBottom: 16,
    },
    input: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },
    addRoutineButton: {
        backgroundColor: '#F50707',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    addRoutineButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    routineScroll: {
        flexDirection: 'row',
    },
});

export default WorkoutPlan;
