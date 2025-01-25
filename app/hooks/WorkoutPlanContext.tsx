import React, { createContext, useContext, useState } from 'react';
import { RoutineType } from '../WorkoutPlan/types/PlanTypes';
import Routine from '../WorkoutPlan/Routine';



// Define the structure of the context value
interface WorkoutPlanContextType {
    activeRoutine: RoutineType | null;
    setActiveRoutine: (activeRoutine: RoutineType) => void;
    defaultRoutine: RoutineType
}

// Create the context with a default value
const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(undefined);

// Create the provider component
export const WorkoutPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const defaultRoutine = new Routine("Routine 1", null)
    const [activeRoutine, setActiveRoutine] = useState<RoutineType | null>(defaultRoutine) // State for workout plan

    return (
        <WorkoutPlanContext.Provider value={{ activeRoutine, setActiveRoutine, defaultRoutine }}>
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
