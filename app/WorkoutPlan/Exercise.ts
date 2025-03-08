import { ExerciseType } from "../../types/PlanTypes";
import { MuscleGroup } from "../../types/PlanTypes";
import { WorkoutParameters } from "../../types/PlanTypes";
import { ExerciseDataType } from "../../types/PlanTypes";

type ExerciseOverrides = {
    name?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
    isCompleted?: boolean;
};

export default class ExerciseClass implements ExerciseType {
    private name: string;
    private sets: number;
    private description: string;
    private reps: number;
    private weight: number;
    private restTime: number;
    private timePerRep: number;
    private isCompleted: boolean;
    private exerciseType: MuscleGroup;
    private url: string;

    constructor(exerciseData: ExerciseDataType, workoutParameters: WorkoutParameters, exerciseType: MuscleGroup, isCompleted?: boolean) {
        this.name = exerciseData.name;
        this.sets = workoutParameters?.sets as number;
        this.reps = workoutParameters?.reps as number;
        this.weight = workoutParameters?.weight as number;
        this.restTime = workoutParameters?.restTime as number;
        this.isCompleted = isCompleted ? isCompleted : false;
        this.exerciseType = exerciseType;
        this.url = exerciseData.url;
        this.timePerRep = exerciseData.timePerRep;
        this.description = exerciseData.description;
    }

    private cloneWith(overrides: ExerciseOverrides): ExerciseClass {
        return new ExerciseClass(
            {
                name: overrides.name ?? this.name,
                url: this.url,
                timePerRep: this.timePerRep,
                description: this.description,
            },
            {
                sets: overrides.sets ?? this.sets,
                reps: overrides.reps ?? this.reps,
                weight: overrides.weight ?? this.weight,
                restTime: overrides.restTime ?? this.restTime,
            },
            this.exerciseType,
            overrides.isCompleted ?? this.isCompleted // Add isCompleted here
        );
    }

    updateExercise(workoutParameters: WorkoutParameters): ExerciseClass {
        return this.cloneWith({
            sets: workoutParameters.sets ?? this.sets,
            reps: workoutParameters.reps ?? this.reps,
            weight: workoutParameters.weight ?? this.weight,
            restTime: workoutParameters.restTime ?? this.restTime,
        });
    }

    setCompleted(completed: boolean): ExerciseClass {
        return this.cloneWith({ isCompleted: completed });
    }

    setName(name: string): ExerciseClass {
        return this.cloneWith({ name });
    }

    setSets(sets: number): ExerciseClass {
        return this.cloneWith({ sets });
    }

    setReps(reps: number): ExerciseClass {
        return this.cloneWith({ reps });
    }

    setWeight(weight: number): ExerciseClass {
        return this.cloneWith({ weight });
    }

    setRestTime(restTime: number): ExerciseClass {
        return this.cloneWith({ restTime });
    }

    getName(): string {
        return this.name;
    }

    getSets(): number {
        return this.sets;
    }

    getReps(): number {
        return this.reps;
    }

    getWeight(): number {
        return this.weight;
    }

    getRestTime(): number {
        return this.restTime;
    }

    getExerciseType(): MuscleGroup {
        return this.exerciseType;
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

    getTotalExerciseTime(): number {
        return (this.getRestTime() * this.getSets()) + (this.getTimePerRep() * this.getReps() * this.getSets());
    }
}
