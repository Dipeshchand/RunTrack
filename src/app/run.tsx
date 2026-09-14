import { Pressable, StyleSheet, Text, View } from "react-native";

import { useRunTracking } from "../hooks/useRunTracking";

export default function RunScreen() {
  const {
    isTracking,
    currentLocation,
    locationPoints,
    distance,
    elapsedTime,
    startTracking,
    stopTracking,
  } = useRunTracking();

  // Convert meters → kilometers
  const distanceInKilometers = distance / 1000;

  // Convert seconds → HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* STATUS */}
      <Text style={styles.title}>{isTracking ? "RUNNING 🟢" : "READY"}</Text>

      {/* DISTANCE */}
      <View style={styles.distanceContainer}>
        <Text style={styles.distance}>{distanceInKilometers.toFixed(2)}</Text>

        <Text style={styles.km}>KM</Text>
      </View>

      {/* TIMER */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>TIME</Text>

        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      </View>

      {/* GPS POINT COUNT */}
      <Text style={styles.points}>GPS Points: {locationPoints.length}</Text>

      {/* CURRENT GPS */}
      {currentLocation && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Current GPS</Text>

          <Text style={styles.locationText}>
            Latitude: {currentLocation.latitude.toFixed(6)}
          </Text>

          <Text style={styles.locationText}>
            Longitude: {currentLocation.longitude.toFixed(6)}
          </Text>

          <Text style={styles.locationText}>
            Accuracy:{" "}
            {currentLocation.accuracy !== null
              ? `${currentLocation.accuracy.toFixed(1)} m`
              : "--"}
          </Text>
        </View>
      )}

      {/* START / STOP */}
      {!isTracking ? (
        <Pressable style={styles.startButton} onPress={startTracking}>
          <Text style={styles.buttonText}>START TRACKING</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.stopButton} onPress={stopTracking}>
          <Text style={styles.buttonText}>STOP RUN</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
  },

  distanceContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  distance: {
    fontSize: 64,
    fontWeight: "800",
  },

  km: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: -8,
  },

  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  timerLabel: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "600",
    marginBottom: 4,
  },

  timer: {
    fontSize: 36,
    fontWeight: "700",
  },

  points: {
    textAlign: "center",
    color: "#666666",
    marginBottom: 20,
  },

  locationCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  locationText: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 4,
  },

  startButton: {
    backgroundColor: "#20C96B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  stopButton: {
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
