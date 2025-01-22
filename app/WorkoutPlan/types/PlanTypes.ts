
export interface RoutineType {
    addExercise: (exercise: ExerciseType) => void
    removeExercise: (exercise: ExerciseType) => void
    getExercises: () => ExerciseType[]
    getName: () => string
    getDuration: () => number  //need to change to string
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
    getExerciseType: () => exercises
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

export type exercises = "Chest" | "Back" | "Legs" | "Arms" | "Shoulders"; 