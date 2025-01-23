import { RoutineType } from "../WorkoutPlan/types/PlanTypes";
import { WorkoutPlanType } from "../WorkoutPlan/types/PlanTypes";
import Routine from "./Routine"
import Exercise from "./Exercise"


export default class Plan implements WorkoutPlanType {

    private name: string;
    private routines: RoutineType[];
    private readonly maxRoutines: number = 5;

    constructor(name: string, routines: RoutineType[]) {
        this.name = name;
        this.routines = routines;
    }

    public getName(): string {
        return this.name;
    }

    public getRoutines(): RoutineType[] {
        return this.routines;
    }

    public setName(name: string): void {
        this.name = name;
    }

    addRoutine(routine: RoutineType): void {
        if (this.routines.length >= this.maxRoutines) {
            throw new Error(`Cannot add more than ${this.maxRoutines} routines.`);
        }
        this.routines.push(routine);
    }

    removeRoutine(routine: RoutineType): void {
        const index = this.routines.indexOf(routine);
        if (index > -1) {
            this.routines.splice(index, 1);
        } else {
            throw new Error("Routine not found.");
        }
    }

    getJson(): string {
        return JSON.stringify(this);
    }

}

