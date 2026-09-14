import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRunTracking } from "../hooks/useRunTracking";

export default function RunScreen() {
  const {
    isTracking,
    currentLocation,
    locationPoints,
    startTracking,
    stopTracking,
  } = useRunTracking();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isTracking ? "RUNNING" : "READY"}</Text>

      <Text style={styles.points}>GPS Points: {locationPoints.length}</Text>

      {currentLocation && (
        <View style={styles.locationCard}>
          <Text>Latitude: {currentLocation.latitude.toFixed(6)}</Text>

          <Text>Longitude: {currentLocation.longitude.toFixed(6)}</Text>

          <Text>
            Accuracy:{" "}
            {currentLocation.accuracy !== null
              ? `${currentLocation.accuracy.toFixed(1)} m`
              : "--"}
          </Text>
        </View>
      )}

      {!isTracking ? (
        <Pressable style={styles.button} onPress={startTracking}>
          <Text style={styles.buttonText}>START TRACKING</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.button, styles.stopButton]}
          onPress={stopTracking}
        >
          <Text style={styles.buttonText}>STOP TRACKING</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
  },

  points: {
    marginTop: 20,
    fontSize: 18,
    color: "#555555",
  },

  locationCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    gap: 8,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#20C96B",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  stopButton: {
    backgroundColor: "#111111",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
