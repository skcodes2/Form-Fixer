import ExerciseClass from "../app/WorkoutPlan/Exercise"
import Routine from "../app/WorkoutPlan/Routine"

export interface RoutineType {
    addExercise: (exercise: ExerciseClass) => Routine
    removeExercise: (exercise: ExerciseClass) => Routine
    getExercises: () => ExerciseClass[]
    getName: () => string
    getDuration: () => number
    removeAllExercises: () => Routine
    resetCompleteness: () => Routine
    getTotalRoutineTime: () => number
}

export type ExerciseType = {
    getName: () => string;
    setName: (name: string) => ExerciseType;
    getSets: () => number;
    setSets: (sets: number) => ExerciseType;
    getReps: () => number;
    setReps: (reps: number) => ExerciseType;
    getWeight: () => number;
    setWeight: (weight: number) => ExerciseType;
    getRestTime: () => number;
    setRestTime: (restTime: number) => ExerciseType;
    getDescription: () => string;
    Completed: () => boolean;
    setCompleted: (completed: boolean) => ExerciseType;
    getExerciseType: () => MuscleGroup;
    getTimePerRep: () => number;
    getUrl: () => string;
    getTotalExerciseTime: () => number;
};

export interface WorkoutPlanType {
    addRoutine: (routine: Routine) => void
    removeRoutine: (routine: RoutineType) => void
    getName: () => string
    setName: (name: string) => void
    getRoutines: () => Routine[]
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
