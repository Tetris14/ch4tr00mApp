import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 3000, // 3 seconds for one full rotation
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotationValue]);

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Welcome to the app</Text>
      </View>
      <Animated.Image
        source={require("@/assets/images/lighthouse_logo_no_bg.png")}
        style={[styles.logo, { transform: [{ rotate: rotateInterpolate }] }]}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    paddingBottom: 50,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    alignItems: "center",
    paddingBottom: 50,
  },
  loginButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
  },
  registerButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    color: "white",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "#000",
  },
  registerButtonText: {
    color: "white",
  },
});
