import { StyleSheet, Text, View } from "react-native";

export default function ProfileViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },
});
