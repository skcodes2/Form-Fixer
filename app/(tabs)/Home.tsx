import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';

export default function Home() {
    return (
        <ImageBackground
            source={require('../../assets/images/homebg.png')}
            style={styles.background}
        >
            <View style={styles.topSection}>
                <Text style={styles.title}><Text style={{ color: '#8F0404' }}>AI</Text> <Text style={{ color: '#FFFFFF' }}>Fitness Trainer</Text></Text>
                <View style={styles.formMasteryContainer}>
                    <View style={styles.leftFormCard}>
                        <View style={styles.iconAndNumberContainer}>
                            <Image
                                source={require('../../assets/images/graph.png')}
                                style={styles.icon}
                            />
                            <Text style={[styles.formNumber, styles.leftFormText]}>5</Text>
                        </View>
                        <Text style={[styles.formLabel, styles.leftFormText]}>Forms Mastered</Text>
                    </View>
                    <View style={styles.formCard}>
                        <View style={styles.iconAndNumberContainer}>
                            <Image
                                source={require('../../assets/images/check.png')}
                                style={styles.icon}
                            />
                            <Text style={styles.formNumber}>7</Text>
                        </View>
                        <Text style={styles.formLabel}>Forms Left</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    leftFormCard: {
        backgroundColor: 'white',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        width: '45%',
    },
    leftFormText: {
        color: '#990000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    topSection: {
        alignItems: 'center',
        marginTop: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formMasteryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
    },
    formCard: {
        backgroundColor: '#990000',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        width: '45%',
    },
    iconAndNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    formNumber: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    formLabel: {
        fontSize: 16,
        color: 'white',
    },
});
