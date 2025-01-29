import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { ImageMap } from '../ExcerciseData';
import { useRouter } from 'expo-router';
import useWorkoutPlan from 'app/hooks/WorkoutPlanContext';
import ExerciseClass from '../Exercise';

interface ChosenExerciseProps {
  exercise: ExerciseClass;
}

export default function ChosenExercise({ exercise }: ChosenExerciseProps) {
  const router = useRouter();
  const { setChosenExercise } = useWorkoutPlan();

  return (
    <TouchableOpacity
      onPress={() => {
        router.replace("/WorkoutPlan/components/UpdateExercisePage");
        setChosenExercise(exercise);
      }}
      style={exercise.Completed() ? styles.containerCompleted : styles.container}
    >
      <Image
        source={ImageMap[exercise.getUrl()]}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={exercise.Completed() ? styles.titleCompleted : styles.title}>
          {exercise.getName()}
        </Text>
        <Text style={exercise.Completed() ? styles.exerciseTypeCompleted : styles.exerciseType}>
          {String(exercise.getExerciseType())}
        </Text>
        <Text
          style={
            exercise.Completed()
              ? styles.workoutParametersCompleted
              : styles.workoutParameters
          }
        >
          {`${exercise.getSets()} Sets   ${exercise.getReps()} Reps Each   ${exercise.getWeight()}lb`}
        </Text>
        <Text style={exercise.Completed() ? styles.restTimeCompleted : styles.restTime}>
          {`Rest Time Per Set - ${exercise.getRestTime()} sec`}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Text style={exercise.Completed() ? styles.iconCompleted : styles.icon}>
          {'>'}
        </Text>
      </View>
    </TouchableOpacity>
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
  containerCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // White background color
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
    borderWidth: 3,
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
  titleCompleted: {
    color: 'black', // Red text color for completed
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseType: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  exerciseTypeCompleted: {
    color: 'black', // Red text color for completed
    fontSize: 14,
    marginBottom: 4,
  },
  workoutParameters: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  workoutParametersCompleted: {
    color: 'black', // Red text color for completed
    fontSize: 14,
    marginBottom: 4,
  },
  restTime: {
    color: 'white',
    fontSize: 12,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  restTimeCompleted: {
    color: 'black', // Red text color for completed
    fontSize: 12,
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
  iconCompleted: {
    color: 'black', // Red text color for completed
    fontSize: 30,
    fontWeight: 'bold',
  },
});
