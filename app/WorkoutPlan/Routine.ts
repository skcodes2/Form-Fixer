import ExerciseClass from "./Exercise";
import { RoutineType } from "../../types/PlanTypes";
import { ExerciseType } from "../../types/PlanTypes";

export default class Routine implements RoutineType {

    private exercises: ExerciseClass[] | null;
    private name: string;
    private duration: number;


    constructor(name: string, exercises: ExerciseClass[] | null) {
        this.name = name;
        this.exercises = exercises ?? [];
        this.duration = this.getTotalRoutineTime();
    }

    addExercise(exercise: ExerciseClass): Routine {
        const newExercises = [exercise, ...(this.exercises || [])];
        return new Routine(this.name, newExercises);
    }
    //return number in seconds 
    getTotalRoutineTime(): number {
        let totalTime = 0;
        this.exercises?.forEach(exercise => {
            totalTime += exercise.getTotalExerciseTime();
        });

        return Math.round((totalTime / 60) * 100) / 100;
    }

    updateDuration(exercise: ExerciseType) {
        this.duration += exercise.getTotalExerciseTime();
    }

    removeExercise(exercise: ExerciseClass): Routine {
        // Ensure exercises is not null and find the index of the exercise
        const index = this.exercises?.indexOf(exercise);

        if (index !== undefined && index > -1) {
            // Create a new array without the exercise to remove
            const newExercises = [...(this.exercises ?? [])];
            newExercises.splice(index, 1);

            // Return a new Routine object with the updated exercises and recalculated duration
            const newRoutine = new Routine(this.name, newExercises);
            return newRoutine;
        } else {
            throw new Error("Exercise not found.");
        }
    }

    resetCompleteness(): Routine {
        const updatedExercises = this.exercises?.map((exercise) => {
            return exercise.setCompleted(false); // Use the setCompleted method to return a new instance
        }) ?? [];

        return new Routine(this.name, updatedExercises);
    }

    getExercises(): ExerciseClass[] {
        return this.exercises ?? [];
    }

    getName(): string {
        return this.name;
    }

    getDuration(): number {
        return this.duration;
    }

    removeAllExercises(): Routine {
        return new Routine(this.name, [])
    }
}