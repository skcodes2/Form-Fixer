import { ExerciseType } from "./types/PlanTypes";
import { exercises } from "./types/PlanTypes";
import { WorkoutParameters } from "./types/PlanTypes";

export default class Exercise implements ExerciseType {

    private name: string;
    private sets: number;
    private description: string;
    private reps: number;
    private weight: number;
    private restTime: number;
    private timePerRep: number;
    private isCompleted: boolean;
    private exerciseType: exercises
    private url: string

    constructor(name: string, workoutParameters: WorkoutParameters, exerciseType: exercises, url: string, timePerRep: number, description: string) {
        this.name = name;
        this.sets = workoutParameters?.sets as number;
        this.reps = workoutParameters?.reps as number;
        this.weight = workoutParameters?.weight as number;
        this.restTime = workoutParameters?.restTime as number;
        this.isCompleted = false;
        this.exerciseType = exerciseType;
        this.url = url
        this.timePerRep = timePerRep
        this.description = description
    }

    updateExercise(workoutParameters: WorkoutParameters): void {
        if (workoutParameters.sets !== null) {
            this.setSets(workoutParameters.sets);
        }
        if (workoutParameters.reps !== null) {
            this.setReps(workoutParameters.reps);
        }
        if (workoutParameters.weight !== null) {
            this.setWeight(workoutParameters.weight);
        }
        if (workoutParameters.restTime !== null) {
            this.setRestTime(workoutParameters.restTime);
        }
    }

    getDescription(): string {
        return this.description
    }

    Completed(): boolean {
        return this.isCompleted;
    }

    getTimePerRep(): number {
        return this.timePerRep
    }

    getUrl(): string {
        return this.url
    }

    getExerciseType(): exercises {
        return this.exerciseType;
    }

    setCompleted(completed: boolean): void {
        this.isCompleted = completed;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getSets(): number {
        return this.sets;
    }

    setSets(sets: number): void {
        this.sets = sets;
    }

    getReps(): number {
        return this.reps;
    }

    setReps(reps: number): void {
        this.reps = reps;
    }

    getWeight(): number {
        return this.weight;
    }

    setWeight(weight: number): void {
        this.weight = weight;
    }

    getRestTime(): number {
        return this.restTime;
    }

    setRestTime(restTime: number): void {
        this.restTime = restTime;
    }

    getTotalExerciseTime(): number {
        return this.getRestTime() + this.getTimePerRep() * this.getReps()
    }

}