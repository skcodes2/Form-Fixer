import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const options = [
    "Weight Loss",
    "Better sleeping habit",
    "Track my nutrition",
    "Improve overall fitness",
];

type Props = {
    onNext: () => void;
    onBack?: () => void; // <-- Make onBack optional
};

const ProfilePicture: React.FC<Props> = ({ onNext, onBack }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black", paddingHorizontal: 16 }}>

            {/* Back Button (only works if onBack is defined) */}
            <TouchableOpacity onPress={() => onBack?.()} style={{ position: "absolute", top: 20, left: 20 }}>
                <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            {/* Heading */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 40, textAlign: "center", color: "white" }}>
                How can we help you?
            </Text>

            {/* Selection Options */}
            <View style={{ width: "100%", maxWidth: 320, marginTop: 30 }}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 14,
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                            marginBottom: 12,
                            borderWidth: selectedOption === option ? 2 : 0,
                            borderColor: selectedOption === option ? "#990000" : "transparent",
                        }}
                        onPress={() => setSelectedOption(option)}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>{option}</Text>
                        <MaterialIcons
                            name={selectedOption === option ? "check-circle" : "radio-button-unchecked"}
                            size={24}
                            color={selectedOption === option ? "#990000" : "#D1D5DB"}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={{
                    width: "100%",
                    maxWidth: 320,
                    marginTop: 30,
                    backgroundColor: selectedOption ? "#990000" : "#D1D5DB",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                }}
                onPress={onNext}
                disabled={!selectedOption}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePicture;
