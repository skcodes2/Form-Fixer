import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const genders = [
    { name: "Male", icon: require("./profile.png") },
    { name: "Female", icon: require("./profile.png") },
];

const GenderSelection: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [selectedGender, setSelectedGender] = useState<string | null>(null);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black", paddingHorizontal: 16 }}>

            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={{ position: "absolute", top: 20, left: 20 }}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Heading */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 24, textAlign: "center", color: "white" }}>
                Select Your Gender
            </Text>

            {/* Gender Selection */}
            <View style={{ flexDirection: "row", gap: 16, marginTop: 20 }}>
                {genders.map((gender, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 12,
                            borderWidth: selectedGender === gender.name ? 3 : 0,
                            borderColor: selectedGender === gender.name ? "#990000" : "transparent",
                            backgroundColor: "#fff",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                        onPress={() => setSelectedGender(gender.name)}
                    >
                        <Image source={gender.icon} style={{ width: 50, height: 50 }} />
                        <Text style={{ fontSize: 16, marginTop: 6, fontWeight: "500" }}>{gender.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={{
                    width: "100%",
                    maxWidth: 320,
                    marginTop: 30,
                    backgroundColor: selectedGender ? "#990000" : "#D1D5DB",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                }}
                onPress={onNext}
                disabled={!selectedGender}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GenderSelection;
