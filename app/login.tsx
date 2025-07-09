import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Login</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
