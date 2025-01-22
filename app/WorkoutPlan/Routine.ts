import { RoutineType } from "./types/PlanTypes";
import { ExerciseType } from "./types/PlanTypes";

export default class Routine implements RoutineType {

    private exercises: ExerciseType[];
    private name: string;
    private duration: number;

    constructor(name: string, exercises: ExerciseType[]) {
        this.name = name;
        this.exercises = exercises;
        this.duration = this.getTotalRoutineTime();
    }

    addExercise(exercise: ExerciseType): void {
        this.exercises.unshift(exercise);
        this.updateDuration(exercise)
    }
    //return number in seconds 
    getTotalRoutineTime(): number {
        let totalTime = 0;
        this.exercises.forEach(exercise => {
            totalTime += exercise.getTotalExerciseTime();
        });
        return totalTime;
    }

    updateDuration(exercise: ExerciseType) {
        this.duration += exercise.getTotalExerciseTime();
    }

    removeExercise(exercise: ExerciseType): void {
        const index = this.exercises.indexOf(exercise);
        if (index > -1) {
            this.exercises.splice(index, 1);
            this.updateDuration(exercise)
        } else {
            throw new Error("Exercise not found.");
        }
    }

    resetCompleteness(): void {
        this.exercises.forEach(exercise => {
            exercise.setCompleted(true);
        });
    }

    getExercises(): ExerciseType[] {
        return this.exercises;
    }

    getName(): string {
        return this.name;
    }

    getDuration(): number {
        return this.duration;
    }

    removeAllExercises(): void {
        this.exercises = [];
    }

}