
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { getProfile } from "../utils/profileStorage";

export default function WelcomeScreen() {

  // New user
  const handleGetStarted = () => {
    router.push("/profile");
  };

  // Existing user
  const handleExistingAccount = async () => {
    const profile = await getProfile();

    if (profile) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.icon}>🏃</Text>

      <Text style={styles.title}>
        RunTrack
      </Text>

      <Text style={styles.subtitle}>
        Track your runs. Improve your performance.
      </Text>

      {/* Get Started */}
      <Pressable
        style={styles.button}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </Pressable>

      {/* Existing Account */}
      <Pressable
        onPress={handleExistingAccount}
      >
        <Text style={styles.existingAccount}>
          I already have an account
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  icon: {
    fontSize: 64,
    marginBottom: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#20C96B",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#20C96B",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  existingAccount: {
    color: "#20C96B",
    fontSize: 16,
    fontWeight: "600",
  },
});
