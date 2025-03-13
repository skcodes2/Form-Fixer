import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const interests = [
    { name: "Technique", icon: require("../../assets/images/onboarding/technique.png") },
    { name: "Alignment", icon: require("../../assets/images/onboarding/alignment.png") },
    { name: "Posture", icon: require("../../assets/images/onboarding/posture.png") },
    { name: "Mobility", icon: require("../../assets/images/onboarding/mobility.png") },
    { name: "Stability", icon: require("../../assets/images/onboarding/stability.png") },
    { name: "Endurance", icon: require("../../assets/images/onboarding/endurance.png") },
    { name: "Strength", icon: require("../../assets/images/onboarding/strength.png") },
    { name: "Recovery", icon: require("../../assets/images/onboarding/recovery.png") },
    { name: "Precision", icon: require("../../assets/images/onboarding/precision.png") },
];

const CustomizeInterests: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleSelection = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
        );
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Heading */}
            <Text style={styles.title}>Time to customize your interests</Text>

            {/* Interests Grid */}
            <FlatList
                data={interests}
                keyExtractor={(item) => item.name}
                numColumns={3}
                contentContainerStyle={styles.interestsContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.interestButton,
                            selectedInterests.includes(item.name) ? styles.selectedInterest : null,
                        ]}
                        onPress={() => toggleSelection(item.name)}
                    >
                        <Image source={item.icon} style={styles.interestIcon} />
                        <Text style={[styles.interestText, { color: selectedInterests.includes(item.name) ? "red" : "black" }]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Continue Button */}
            <TouchableOpacity
                style={[
                    styles.continueButton,
                    selectedInterests.length > 0 ? styles.activeButton : styles.disabledButton,
                ]}
                onPress={onNext}
                disabled={selectedInterests.length === 0}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomizeInterests;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "black",
        paddingHorizontal: 16,
        paddingBottom: 30, // Prevents cutting off the button
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 120, // Pushes the title lower
        color: "white",
    },
    interestsContainer: {
        marginTop: 50,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    interestButton: {
        width: 95,
        height: 95,
        marginTop: 15,
        margin: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 45,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedInterest: {
        borderWidth: 5,
        borderColor: "#990000",
    },
    interestIcon: {
        width: 40,
        height: 40,
        borderColor: "white",
    },
    interestText: {
        fontSize: 12,
        marginTop: 6,
        textAlign: "center",
    },
    continueButton: {
        width: "90%",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: "50%",
    },
    activeButton: {
        backgroundColor: "#990000",
    },
    disabledButton: {
        backgroundColor: "#D1D5DB",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
