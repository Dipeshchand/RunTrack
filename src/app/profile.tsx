import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import { saveProfile } from "../utils/profileStorage";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");

  const handleContinue = async () => {
    await saveProfile({
      name,
      age,
      height,
      weight,
      goal,
    });

    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Your Profile</Text>

        <Text style={styles.subtitle}>
          Tell us a little about yourself
        </Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Height */}
        <Text style={styles.label}>Height</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        {/* Weight */}
        <Text style={styles.label}>Weight</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        {/* Running Goal */}
        <Text style={styles.label}>Running Goal</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={goal}
            onValueChange={(itemValue) => setGoal(itemValue)}
          >
            <Picker.Item label="Select your goal" value="" />
            <Picker.Item label="5K" value="5K" />
            <Picker.Item label="10K" value="10K" />
            <Picker.Item
              label="Half Marathon"
              value="Half Marathon"
            />
            <Picker.Item label="Marathon" value="Marathon" />
          </Picker>
        </View>

        {/* Continue */}
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 32,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },

  button: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#20C96B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});