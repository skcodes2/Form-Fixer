
export interface RoutineType {
    addExercise: (exercise: ExerciseType) => void
    removeExercise: (exercise: ExerciseType) => void
    getExercises: () => ExerciseType[]
    getName: () => string
    getDuration: () => number
    removeAllExercises: () => void
    resetCompleteness: () => void
    getTotalRoutineTime: () => number
}

export type ExerciseType = {
    getName: () => string,
    setName: (name: string) => void,
    getSets: () => number,
    setSets: (sets: number) => void,
    getReps: () => number,
    setReps: (reps: number) => void,
    getWeight: () => number,
    setWeight: (weight: number) => void
    setRestTime: (restTime: number) => void
    getRestTime: () => number
    setCompleted: (completed: boolean) => void
    Completed: () => boolean
    getExerciseType: () => MuscleGroup
    getUrl: () => string
    getTimePerRep: () => number
    getTotalExerciseTime: () => number
    getDescription: () => string
}

export interface WorkoutPlanType {
    addRoutine: (routine: RoutineType) => void
    removeRoutine: (routine: RoutineType) => void
    getName: () => string
    setName: (name: string) => void
    getRoutines: () => RoutineType[]
}

export type WorkoutParameters = {
    sets: number | null,
    reps: number | null,
    weight: number | null,
    restTime: number | null,
}

export type MuscleGroup = "Chest" | "Back" | "Legs" | "Arms" | "Shoulders";

export interface ExerciseDataType {
    name: string; // Name of the exercise
    description: string; // Description of the exercise
    timePerRep: number; // Time per repetition (in seconds)
    url: string; // URL to the image
}
