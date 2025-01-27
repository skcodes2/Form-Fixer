import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { ImageMap } from '../ExcerciseData';
import { ExerciseType } from '../types/PlanTypes';

interface ChosenExerciseProps {
  exercise: ExerciseType;
}

export default function ChosenExercise({ exercise }: ChosenExerciseProps) {
  return (
    <View style={styles.container}>

      <Image
        source={ImageMap[exercise.getUrl()]}
        style={styles.image}
      />
      <View style={styles.infoContainer}>

        <Text style={styles.title}>{exercise.getName()}</Text>

        <Text style={styles.exerciseType}>{String(exercise.getExerciseType())}</Text>

        <Text style={styles.workoutParameters}>
          {`${exercise.getSets()} Sets   ${exercise.getReps()} Reps Each   ${exercise.getWeight()}lb`}
        </Text>

        <Text style={styles.restTime}>
          {`Rest Time Per Set - ${exercise.getRestTime()} sec`}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{'>'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F50707', // Red background color
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3, // Add a subtle shadow for depth
    borderWidth: 3,
    borderColor: 'black',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'black', // Border around the image
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'black', // Outline color
    textShadowOffset: { width: 1, height: 1 }, // Offset for the shadow
    textShadowRadius: 1, // Spread of the shadow
  },
  exerciseType: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  workoutParameters: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  restTime: {
    color: 'white',
    fontSize: 12,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
