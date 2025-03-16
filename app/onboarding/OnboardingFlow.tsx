import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ProfilePicture from "./Page1";
import HelpSelection from "./Page2";
import CustomizeInterests from "./Page3";
import GenderSelection from "./Page4";
import useUser from "app/hooks/UserContext";

export default function OnboardingFlow() {
    const [step, setStep] = useState<number>(0);
    const router = useRouter();
    const { user } = useUser();


    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Final page => go to tabs
            router.replace("/(tabs)/Home");
        }
    };

    const previousStep = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <ProfilePicture onNext={nextStep} />;
            case 1:
                return <HelpSelection onNext={nextStep} onBack={previousStep} />;
            case 2:
                return <CustomizeInterests onNext={nextStep} onBack={previousStep} />;
            case 3:
                return <GenderSelection onNext={nextStep} onBack={previousStep} />;
            default:
                return null;
        }
    };

    return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
});
