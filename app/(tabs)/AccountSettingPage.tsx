import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useGlobalStyle from "../hooks/GlobalStyleContext";

export default function AccountSettingsPage() {
    const globalStyle = useGlobalStyle();

    // Mock user data (Replace with actual API call or context)
    const [user, setUser] = useState({
        fname: "Alex",
        lname: "Johnson",
        age: 30,
        email: "alexjohnson@gmail.com",
    });

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user, currentPassword: "", newPassword: "" });

    const handleInputChange = (key: string, value: string | number) => {
        setFormData({ ...formData, [key]: value });
    };

    const saveChanges = () => {
        // Save changes logic (e.g., API call)
        console.log("Updated Data:", formData);
        setUser({ ...formData });
        setEditing(false);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { fontFamily: globalStyle.fontStyle.titleFont }]}>
                    Edit Profile
                </Text>
                {editing && (
                    <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                        <Text style={[styles.saveButtonText, { fontFamily: globalStyle.fontStyle.textFont }]}>
                            SAVE
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
                <FontAwesome name="user-circle" size={80} color={globalStyle.colors.primary} />
                <TouchableOpacity>
                    <Text style={[styles.uploadText, { fontFamily: globalStyle.fontStyle.textFont }]}>
                        Upload image
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Form Sections */}
            <View style={styles.formSection}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    {editing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.fname}
                            onChangeText={(text) => handleInputChange("fname", text)}
                        />
                    ) : (
                        <Text style={styles.valueText}>{user.fname}</Text>
                    )}
                </View>

                {/* Last Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    {editing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.lname}
                            onChangeText={(text) => handleInputChange("lname", text)}
                        />
                    ) : (
                        <Text style={styles.valueText}>{user.lname}</Text>
                    )}
                </View>

                {/* Age */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age</Text>
                    {editing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.age.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => handleInputChange("age", parseInt(text))}
                        />
                    ) : (
                        <Text style={styles.valueText}>{user.age}</Text>
                    )}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    {editing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange("email", text)}
                        />
                    ) : (
                        <Text style={styles.valueText}>{user.email}</Text>
                    )}
                </View>

                {/* Change Password Section */}
                {editing && (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                value={formData.currentPassword}
                                onChangeText={(text) => handleInputChange("currentPassword", text)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                value={formData.newPassword}
                                onChangeText={(text) => handleInputChange("newPassword", text)}
                            />
                        </View>
                    </>
                )}
            </View>

            {/* Edit Button */}
            {!editing && (
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: globalStyle.colors.primary }]}
                    onPress={() => setEditing(true)}
                >
                    <Text style={[styles.editButtonText, { fontFamily: globalStyle.fontStyle.textFont }]}>
                        Edit
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        color: "#fff",
    },
    saveButton: {
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
    },
    saveButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
    profileSection: {
        alignItems: "center",
        marginVertical: 20,
    },
    uploadText: {
        color: "#fff",
        marginTop: 10,
    },
    formSection: {
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 5,
    },
    valueText: {
        color: "#aaa",
        fontSize: 16,
    },
    editButton: {
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 20,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

