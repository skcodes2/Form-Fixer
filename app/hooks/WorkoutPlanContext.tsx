import React, { createContext, useContext, useState } from 'react';
import { RoutineType } from '../WorkoutPlan/types/PlanTypes';
import Routine from '../WorkoutPlan/Routine';



// Define the structure of the context value
interface WorkoutPlanContextType {
    activeRoutine: Routine | null;
    setActiveRoutine: React.Dispatch<React.SetStateAction<Routine | null>>
    routines: Routine[]
    setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>

}

// Create the context with a default value
const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(undefined);

// Create the provider component
export const WorkoutPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const defaultRoutine = new Routine("Routine 1", null)
    const [activeRoutine, setActiveRoutine] = useState<Routine | null>(defaultRoutine)
    const [routines, setRoutines] = useState<Routine[]>([defaultRoutine]);

    return (
        <WorkoutPlanContext.Provider value={{ activeRoutine, setActiveRoutine, setRoutines, routines }}>
            {children}
        </WorkoutPlanContext.Provider>
    );
};

const useWorkoutPlan = (): WorkoutPlanContextType => {
    const context = useContext(WorkoutPlanContext);
    if (!context) {
        throw new Error('useWorkoutPlan must be used within a WorkoutPlanProvider');
    }
    return context;
};

export default useWorkoutPlan;
