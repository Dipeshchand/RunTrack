import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const goals = [
  "General Fitness",
  "Weight Loss",
  "5K",
  "10K",
  "Half Marathon",
  "Improve Pace",
];

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");

  const [showGoals, setShowGoals] = useState(false);

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }

    if (!age.trim()) {
      Alert.alert("Missing Age", "Please enter your age.");
      return;
    }

    if (!height.trim()) {
      Alert.alert("Missing Height", "Please enter your height.");
      return;
    }

    if (!weight.trim()) {
      Alert.alert("Missing Weight", "Please enter your weight.");
      return;
    }

    if (!goal) {
      Alert.alert("Missing Goal", "Please select your running goal.");
      return;
    }

    router.push({
      pathname: "/home",
      params: {
        name: name.trim(),
        age,
        height,
        weight,
        goal,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tell us about yourself</Text>

        <Text style={styles.subtitle}>
          This helps us give you better insights.
        </Text>

        {/* Profile image placeholder */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999999"
          value={name}
          onChangeText={setName}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#999999"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Height */}
        <Text style={styles.label}>Height</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your height (cm)"
          placeholderTextColor="#999999"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        {/* Weight */}
        <Text style={styles.label}>Weight</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your weight (kg)"
          placeholderTextColor="#999999"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        {/* Running Goal */}
        <Text style={styles.label}>Running Goal</Text>

        <Pressable
          style={styles.input}
          onPress={() => {
            Keyboard.dismiss();
            setShowGoals(!showGoals);
          }}
        >
          <View style={styles.goalRow}>
            <Text style={goal ? styles.goalText : styles.placeholderText}>
              {goal || "Select your running goal"}
            </Text>

            <Text style={styles.arrow}>{showGoals ? "▲" : "▼"}</Text>
          </View>
        </Pressable>

        {/* Goal options */}
        {showGoals && (
          <View style={styles.goalList}>
            {goals.map((item) => (
              <Pressable
                key={item}
                style={styles.goalOption}
                onPress={() => {
                  setGoal(item);
                  setShowGoals(false);
                }}
              >
                <Text style={styles.goalOptionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Continue */}
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 1,
    fontSize: 15,
    color: "#777777",
    lineHeight: 22,
  },

  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 25,
  },

  avatar: {
    fontSize: 42,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111111",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  placeholderText: {
    color: "#999999",
    fontSize: 16,
  },

  goalText: {
    color: "#111111",
    fontSize: 16,
  },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: 14,
    color: "#666666",
  },

  goalList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  goalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  goalOptionText: {
    fontSize: 15,
    color: "#222222",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#20C96B",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
