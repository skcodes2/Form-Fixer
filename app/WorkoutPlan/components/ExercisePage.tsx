import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { getMuscleGroupData } from '../ExcerciseData';
import { ExerciseDataType } from '../types/PlanTypes';
import Exercise from './Exercise';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ExercisePage() {
  const [muscleGroupData, setMuscleGroupData] = useState<ExerciseDataType[]>(getMuscleGroupData('Chest'));
  const dropdownData = [
    { label: 'Chest', value: 'Chest' },
    { label: 'Back', value: 'Back' },
    { label: 'Shoulder', value: 'Shoulders' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Arms', value: 'Arms' },
  ];
  const router = useRouter();
  const [dropdownValue, setDropdownValue] = useState(null);

  return (
    <View style={styles.container}>



      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/workout/dumbell.png')} // Replace with your dumbbell icon path
          style={styles.icon}
        />
        <Text style={styles.headerText}>Add Exercise</Text>
      </View>
      <View style={styles.separator} />

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
        placeholder="Chest"
        value={dropdownValue}
        onChange={(item) => { setDropdownValue(item.value); setMuscleGroupData(getMuscleGroupData(item.value)) }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons name="arm-flex" size={24} color="white" style={styles.armIcon} />
        )}
      />


      {muscleGroupData.map((exerciseData, index) => {
        return <Exercise key={index} exerciseData={exerciseData} />;
      })}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/WorkoutPlan")} style={styles.BackButton}>
          <Text style={styles.BackButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2424',
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: 'black',
    borderRadius: 8,
  },
  dropdownPlaceholder: {
    color: 'white',
    fontSize: 20,
  },
  armIcon: {
    marginRight: 8,
    height: 30,
    width: 30,
  },
  dropdownSelectedText: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,

  },
  icon: {
    width: 45,
    height: 45,
    marginRight: 10,
    tintColor: 'white',
    transform: [{ rotate: '40deg' }],

  },
  headerText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#FFF',
    width: '100%',
    marginTop: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  BackButton: {
    backgroundColor: '#F50707',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  BackButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
