import { RoutineType } from "../WorkoutPlan/types/PlanTypes";
import { WorkoutPlanType } from "../WorkoutPlan/types/PlanTypes";
import Routine from "./Routine";

export default class Plan implements WorkoutPlanType {
    private name: string;
    private routines: Routine[];
    private readonly maxRoutines: number = 5;

    constructor(name: string, routines: Routine[]) {
        this.name = name;
        this.routines = routines;
    }

    public getName(): string {
        return this.name;
    }

    public getRoutines(): Routine[] {
        return this.routines;
    }

    public setName(name: string): Plan {
        return this.cloneWith({ name });
    }

    addRoutine(routine: Routine): Plan {
        if (this.routines.length >= this.maxRoutines) {
            throw new Error(`Cannot add more than ${this.maxRoutines} routines.`);
        }
        return this.cloneWith({ routines: [...this.routines, routine] });
    }

    removeRoutine(routine: RoutineType): Plan {
        const updatedRoutines = this.routines.filter(r => r !== routine);
        if (updatedRoutines.length === this.routines.length) {
            throw new Error("Routine not found.");
        }
        return this.cloneWith({ routines: updatedRoutines });
    }

    getJson(): string {
        return JSON.stringify(this);
    }

    private cloneWith(overrides: Partial<{ name: string; routines: Routine[] }>): Plan {
        return new Plan(
            overrides.name ?? this.name,
            overrides.routines ?? [...this.routines]
        );
    }
}
