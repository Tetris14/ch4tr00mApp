import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { API_URL } from "@/constants/Colors";
import { useUserStore } from "@/stores/userStore";
import { Redirect, router } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  const handleUsername = async (username: string) => {
    setIsLoading(true);
    const response = await fetch(
      `${API_URL}/users/is-username-valid/${username}`
    );
    const data = await response.json();
    if (data.success) {
      setUsernameIsValid(true);
    } else {
      setError("Username is not valid");
      Alert.alert("Username is not valid");
    }
    setIsLoading(false);
  };

  const handleNumberPress = (number: string) => {
    if (password.length < 6) {
      const newPassword = password + number;
      setPassword(newPassword);

      // Auto-login when 6 digits are entered
      if (newPassword.length === 6) {
        handleLogin(newPassword);
      }
    }
  };

  const handleLogin = async (pinPassword: string) => {
    setIsLoading(true);
    setError("");
    console.log("Logging in with pin: ", pinPassword);
    console.log("Username: ", username);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: pinPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 201 && data.userId && data.jwt) {
        // Handle successful login
        console.log("Login successful, userId:", data.userId);
        console.log("JWT token:", data.jwt);
        Alert.alert("Success", "Login successful!");
        useUserStore.setState({ jwt: data.jwt, isAuthenticated: true });
        router.push("/");
      } else {
        // Handle failed login
        setError(data.message || "Invalid username or password");
        Alert.alert("Error", data.message || "Invalid username or password");
        // Clear password on failed login
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
      Alert.alert("Error", "Network error. Please try again.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = () => {
    setPassword("");
  };

  const handleDeleteOne = () => {
    setPassword(password.slice(0, -1));
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            i < password.length ? styles.dotFilled : styles.dotEmpty,
          ]}
        />
      );
    }
    return dots;
  };

  if (!usernameIsValid) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Enter your username</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUsername(username)}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Next"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setUsernameIsValid(false)}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter your PIN</Text>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Password dots indicator */}
      <View style={styles.dotsContainer}>{renderDots()}</View>

      {/* Loading indicator */}
      {isLoading && <Text style={styles.loadingText}>Logging in...</Text>}

      {/* Numpad */}
      <View style={styles.numpadContainer}>
        {/* First row: 1, 2, 3 */}
        <View style={styles.numpadRow}>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("1")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("2")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("3")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>3</Text>
          </TouchableOpacity>
        </View>

        {/* Second row: 4, 5, 6 */}
        <View style={styles.numpadRow}>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("4")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("5")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("6")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>6</Text>
          </TouchableOpacity>
        </View>

        {/* Third row: 7, 8, 9 */}
        <View style={styles.numpadRow}>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("7")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("8")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("9")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>9</Text>
          </TouchableOpacity>
        </View>

        {/* Fourth row: Del, 0, ← */}
        <View style={styles.numpadRow}>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={handleDeleteAll}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>Del</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={() => handleNumberPress("0")}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numpadButton,
              isLoading && styles.numpadButtonDisabled,
            ]}
            onPress={handleDeleteOne}
            disabled={isLoading}
          >
            <Text style={styles.numpadButtonText}>←</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    width: "50%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    color: "white",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 50,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginHorizontal: 8,
  },
  dotEmpty: {
    backgroundColor: "#ccc",
  },
  dotFilled: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  numpadContainer: {
    width: 300,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numpadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  numpadButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  numpadButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#ccc",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
