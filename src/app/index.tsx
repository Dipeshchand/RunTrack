import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Text style={styles.runner}>🏃</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.highlight}>RunTrack</Text>
        </Text>

        <Text style={styles.subtitle}>
          Track your runs, see your progress and become a better you.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.loginText}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  runner: {
    fontSize: 100,
  },

  content: {
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },

  highlight: {
    color: "#20C96B",
  },

  subtitle: {
    marginTop: 12,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
    color: "#777777",
    textAlign: "center",
    maxWidth: 320,
  },

  button: {
    width: "100%",
    paddingVertical: 17,
    borderRadius: 14,
    backgroundColor: "#20C96B",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555555",
  },
});
