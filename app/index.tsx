import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useGlobalStyle } from './hooks/GlobalStyleContext';
import * as Haptics from 'expo-haptics';

export default function Index() {
  const router = useRouter();
  const globalStyle = useGlobalStyle();

  const handleLogin = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate to the Home screen
    router.replace('/(tabs)/Home');
  };

  return (
    <ImageBackground
      source={require('../assets/images/loginbg.jpg')}
      style={[styles.background, { backgroundColor: globalStyle.colors.bgColor }]}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: globalStyle.fontStyle.titleFont, fontSize: globalStyle.fontSize.xl }]}>
          <Text style={[styles.highlight, { color: globalStyle.colors.primary }]}>AI </Text>
          Fitness Trainer
        </Text>

        <View style={[styles.inputContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <FontAwesome name="envelope" size={20} color="white" style={styles.icon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="white"
            style={[styles.input, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.s }]}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <FontAwesome name="lock" size={20} color="white" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="white"
            style={[styles.input, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.s }]}
            secureTextEntry
          />
        </View>

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.xs }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: globalStyle.colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleLogin();
          }}
        >
          <Text style={[styles.loginButtonText, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.m }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleLogin();
          }}
        >
          <Text style={[styles.googleButtonText, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.m }]}>Google Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {

    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    marginVertical: 10,
    marginRight: 220,

  },
  highlight: {
    fontWeight: 'bold'
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginVertical: 0,
  },
  loginButtonText: {
    color: 'white',

    fontWeight: 700,
  },
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  googleButtonText: {
    color: 'black',

    fontWeight: 700,
  },
});
