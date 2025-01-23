import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure this library is installed

const WorkoutPlan = () => {
    const [dropdownValue, setDropdownValue] = useState(null);

    const dropdownData = [
        { label: 'Edit Routine', value: 'edit' },
        { label: 'Delete Routine', value: 'delete' },
        { label: 'Share Routine', value: 'share' },
    ];

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    inputSearchStyle={styles.inputSearch}
                    data={dropdownData}
                    activeColor='red'
                    itemTextStyle={{ color: 'white' }}
                    labelField="label"
                    valueField="value"
                    placeholder="Your Workout Plan"
                    value={dropdownValue}
                    onChange={item => {
                        setDropdownValue(item.value);

                    }}
                    renderLeftIcon={() => (
                        <MaterialIcons name="access-time" size={24} color="white" style={styles.clockIcon} />
                    )}
                />
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuDots}>⋮</Text>
                </TouchableOpacity>


            </View>

            {/* Routines */}
            <View style={styles.routinesContainer}>
                <ScrollView horizontal style={styles.routineScroll}>


                </ScrollView>
                <TouchableOpacity style={styles.newRoutineButton}>
                    <Text style={styles.newRoutineText}>New Routine</Text>
                </TouchableOpacity>

            </View>


            {/* Total Info */}
            <View style={styles.totalInfo}>
                <Text style={styles.totalText}>Total of 4 | 64mins</Text>
                <View style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>+ Add Exercise</Text>
                </View>
            </View>

            {/* Exercise List */}
            <ScrollView style={styles.exerciseList} horizontal={false}>
                <View style={styles.exerciseCard}>
                    <Text style={styles.placeholderText}>Custom Exercise Component</Text>
                </View>
                <View style={styles.exerciseCard}>
                    <Text style={styles.placeholderText}>Custom Exercise Component</Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Remove All</Text>
                </View>
                <View style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Rest</Text>
                </View>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clockIcon: {
        marginRight: 8,
    },
    dropdown: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingHorizontal: 12,
        width: "90%",
        height: 50,

    },
    routinesContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8,
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderColor: 'white',
    },
    inputSearch: {
        color: 'white',
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
    routineScroll: {
        flexDirection: 'row',

    },

    activeTab: {
        backgroundColor: '#007AFF',
    },
    newRoutineButton: {
        backgroundColor: '#ff4d4d',
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
        backgroundColor: '#ff4d4d',
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
        backgroundColor: '#d32f2f',
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
        backgroundColor: '#ff4d4d',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default WorkoutPlan;
