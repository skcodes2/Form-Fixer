import { View, Text } from 'react-native'
import React from 'react'
import { getMuscleGroupData } from '../ExcerciseData'
import Exercise from './Exercise'


export default function ExercisePage() {
  const muscleGroupData = getMuscleGroupData("Chest")
  return (
    <View>
      {muscleGroupData.map((exerciseData) => {
        return (
          <Exercise exerciseData={exerciseData} />
        )
      })}

    </View>
  )
}