import { MuscleGroup } from "./types/PlanTypes";
import { ExerciseDataType } from "./types/PlanTypes";



const ExerciseData: Record<MuscleGroup, ExerciseDataType[]> = {
    Chest: [
        {
            name: "Bench Press",
            description: "Lay on a bench and push the barbell up and down.",
            timePerRep: 2,
            url: '../../assets/images/workout/benchPress.jpg',
        },
        {
            name: "Incline Bench Press",
            description: "Lay on an incline bench and push the barbell upward to target the upper chest.",
            timePerRep: 2,
            url: '../../assets/images/workout/inclineBenchPress.jpg',
        },
        {
            name: "Chest Fly",
            description: "Use dumbbells or a machine to perform a wide arc motion, bringing your hands together to target the chest.",
            timePerRep: 3,
            url: '../../assets/images/workout/chestFly.jpg',
        },
        {
            name: "Push-Ups",
            description: "Perform a bodyweight exercise by pushing your body up from the ground, targeting the chest and triceps.",
            timePerRep: 1.5,
            url: '../../assets/images/workout/pushUp.jpeg',
        },
    ],

    Back: [
        {
            name: "Pull-Ups",
            description: "Hang from a bar and pull yourself up until your chin is above the bar.",
            timePerRep: 2,
            url: "../../assets/images/workout/pullUp.png",
        },
        {
            name: "Deadlift",
            description: "Lift a barbell from the ground to your hips, focusing on the back and legs.",
            timePerRep: 3,
            url: "../../assets/images/workout/deadlift.jpg",
        },
        {
            name: "Bent-Over Rows",
            description: "Hold a barbell or dumbbells and row them to your torso while bent over.",
            timePerRep: 2,
            url: "../../assets/images/workout/bentOverRow.jpg",
        },
        {
            name: "Lat Pulldown",
            description: "Pull a cable bar down to your chest to target the latissimus dorsi.",
            timePerRep: 2,
            url: "../../assets/images/workout/latPullDown.png",
        },
        {
            name: "Rows",
            description: "Use a T-bar row machine or barbell setup to pull the weight toward your torso.",
            timePerRep: 2,
            url: "../../assets/images/workout/rows.png",
        },
    ],

    Legs: [
        {
            name: "Squats",
            description: "Lower your body into a sitting position and stand back up, targeting the legs and glutes.",
            timePerRep: 2,
            url: "../../assets/images/workout/squat.png",
        },
        {
            name: "Leg Press",
            description: "Push the weight away using your legs on a leg press machine.",
            timePerRep: 2,
            url: "../../assets/images/workout/legPress.png",
        },
        {
            name: "Calf Raises",
            description: "Lift your heels off the ground to target the calves.",
            timePerRep: 1.5,
            url: "../../assets/images/workout/calfRaise.png",
        },
    ],

    Arms: [
        {
            name: "Bicep Curls",
            description: "Curl dumbbells or a barbell to your chest to target the biceps.",
            timePerRep: 2,
            url: "../../assets/images/workout/biceptCurl.png",
        },
        {
            name: "Tricep Dips",
            description: "Lower and raise your body using parallel bars to target the triceps.",
            timePerRep: 2.5,
            url: "../../assets/images/workout/triceptDip.png",
        },
        {
            name: "Tricep Pull Down",
            description: "Lower and raise your body using parallel bars to target the triceps.",
            timePerRep: 2.5,
            url: "../../assets/images/workout/triceptPullDown.png",
        },
        {
            name: "Hammer Curls",
            description: "Curl dumbbells with a neutral grip to target the biceps and forearms.",
            timePerRep: 2,
            url: "../../assets/images/workout/hammerCurl.png",
        },
        {
            name: "Skull Crushers",
            description: "Lie on a bench and lower a barbell or dumbbells to your forehead to target the triceps.",
            timePerRep: 2.5,
            url: "../../assets/images/workout/skullCrusher.png",
        },
        {
            name: "Preacher Curls",
            description: "Use a preacher curl bench to isolate the biceps while curling a barbell or dumbbell.",
            timePerRep: 2,
            url: "../../assets/images/workout/preacherCurl.png",
        },
    ],

    Shoulders: [
        {
            name: "Lateral Raises",
            description: "Raise dumbbells to your sides to target the lateral deltoids.",
            timePerRep: 2,
            url: "../../assets/images/workout/lateralRaise.png",
        },
        {
            name: "Front Raises",
            description: "Raise dumbbells in front of you to target the anterior deltoids.",
            timePerRep: 2,
            url: "../../assets/images/workout/frontRaise.png",
        },
        {
            name: "Shoulder Press",
            description: "Rotate dumbbells as you press them overhead, targeting all parts of the deltoids.",
            timePerRep: 2.5,
            url: "../../assets/images/workout/shoulderPress.png",
        },
        {
            name: "Rear Delt Fly",
            description: "Bend over and raise dumbbells outward to target the rear delts.",
            timePerRep: 2,
            url: "../../assets/images/workout/rearDeltFly.png",
        },
    ],
};


export default ExerciseData;

export function getMuscleGroupData(muscleGroup: MuscleGroup) {
    if (ExerciseData.hasOwnProperty(muscleGroup)) {
        return ExerciseData[muscleGroup];
    } else {
        console.error(`Invalid muscle group: ${muscleGroup}`);
        return []; // Return an empty array if the muscle group doesn't exist
    }
}

export const ImageMap: Record<string, any> = {
    '../../assets/images/workout/benchPress.jpg': require('../../assets/images/workout/benchPress.jpg'),
    '../../assets/images/workout/inclineBenchPress.jpg': require('../../assets/images/workout/inclineBenchPress.jpg'),
    '../../assets/images/workout/chestFly.jpg': require('../../assets/images/workout/chestFly.jpg'),
    '../../assets/images/workout/pushUp.jpeg': require('../../assets/images/workout/pushUp.jpeg'),
    '../../assets/images/workout/pullUp.png': require('../../assets/images/workout/pullUp.png'),
    '../../assets/images/workout/deadlift.jpg': require('../../assets/images/workout/deadlift.jpg'),
    '../../assets/images/workout/bentOverRow.jpg': require('../../assets/images/workout/bentOverRow.jpg'),
    '../../assets/images/workout/latPullDown.png': require('../../assets/images/workout/latPullDown.png'),
    '../../assets/images/workout/rows.png': require('../../assets/images/workout/rows.png'),
    '../../assets/images/workout/squat.png': require('../../assets/images/workout/squat.png'),
    '../../assets/images/workout/legPress.png': require('../../assets/images/workout/legPress.png'),
    '../../assets/images/workout/calfRaise.png': require('../../assets/images/workout/calfRaise.png'),
    '../../assets/images/workout/biceptCurl.png': require('../../assets/images/workout/biceptCurl.png'),
    '../../assets/images/workout/triceptDip.png': require('../../assets/images/workout/triceptDip.png'),
    '../../assets/images/workout/triceptPullDown.png': require('../../assets/images/workout/triceptPullDown.png'),
    '../../assets/images/workout/hammerCurl.png': require('../../assets/images/workout/hammerCurl.png'),
    '../../assets/images/workout/skullCrusher.png': require('../../assets/images/workout/skullCrusher.png'),
    '../../assets/images/workout/preacherCurl.png': require('../../assets/images/workout/preacherCurl.png'),
    '../../assets/images/workout/lateralRaise.png': require('../../assets/images/workout/lateralRaise.png'),
    '../../assets/images/workout/frontRaise.png': require('../../assets/images/workout/frontRaise.png'),
    '../../assets/images/workout/shoulderPress.png': require('../../assets/images/workout/shoulderPress.png'),
    '../../assets/images/workout/rearDeltFly.png': require('../../assets/images/workout/rearDeltFly.png'),
};