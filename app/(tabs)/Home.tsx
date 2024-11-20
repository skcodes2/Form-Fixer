import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function Home() {
    return (
        <ImageBackground
            source={require('../../assets/images/homebg.png')}
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Text style={styles.text}>Home</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: 'white',
    },
});
