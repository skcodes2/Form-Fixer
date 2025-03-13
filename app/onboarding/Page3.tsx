import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const interests = [
    { name: "Fashion", icon: require("./profile.png") },
    { name: "Organic", icon: require("./profile.png") },
    { name: "Meditation", icon: require("./profile.png") },
    { name: "Fitness", icon: require("./profile.png") },
    { name: "Smoke free", icon: require("./profile.png") },
    { name: "Sleep", icon: require("./profile.png") },
    { name: "Health", icon: require("./profile.png") },
    { name: "Running", icon: require("./profile.png") },
    { name: "Vegan", icon: require("./profile.png") },
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
                        <Text style={styles.interestText}>{item.name}</Text>
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
        color: "white"
    },
    interestsContainer: {
        marginTop: 50,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    interestButton: {
        width: 90,
        height: 90,
        margin: 8,
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
        borderWidth: 3,
        borderColor: "#990000",
    },
    interestIcon: {
        width: 40,
        height: 40,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'white'
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
