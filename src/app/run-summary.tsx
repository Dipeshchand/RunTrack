import { router, useLocalSearchParams } from "expo-router";

import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RunSummaryScreen() {
  const { distance, elapsedTime, pace, points } = useLocalSearchParams<{
    distance: string;
    elapsedTime: string;
    pace: string;
    points: string;
  }>();

  /*
   * Convert seconds into HH:MM:SS
   */
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  /*
   * Convert pace seconds into MM:SS
   */
  const formatPace = (paceSeconds: number) => {
    if (!Number.isFinite(paceSeconds) || paceSeconds <= 0) {
      return "--:--";
    }

    const minutes = Math.floor(paceSeconds / 60);

    const seconds = Math.floor(paceSeconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const distanceInKilometers = Number(distance || 0) / 1000;

  const totalElapsedTime = Number(elapsedTime || 0);

  const totalPace = Number(pace || 0);

  const totalPoints = Number(points || 0);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Run Complete 🎉</Text>

      <Text style={styles.subtitle}>Great job! Here's your run.</Text>

      {/* MAIN DISTANCE */}
      <View style={styles.mainStat}>
        <Text style={styles.distance}>{distanceInKilometers.toFixed(2)}</Text>

        <Text style={styles.km}>KM</Text>
      </View>

      {/* STATS */}

      <View style={styles.statsContainer}>
        {/* TIME */}
        <View style={styles.statCard}>
          <Text style={styles.label}>TIME</Text>

          <Text style={styles.value}>{formatTime(totalElapsedTime)}</Text>
        </View>

        {/* PACE */}
        <View style={styles.statCard}>
          <Text style={styles.label}>PACE</Text>

          <Text style={styles.value}>{formatPace(totalPace)}</Text>

          <Text style={styles.unit}>/km</Text>
        </View>

        {/* GPS POINTS */}
        <View style={styles.statCard}>
          <Text style={styles.label}>GPS POINTS</Text>

          <Text style={styles.value}>{totalPoints}</Text>
        </View>
      </View>

      {/* DONE */}
      <Pressable
        style={styles.doneButton}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.buttonText}>DONE</Text>
      </Pressable>
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
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    color: "#777777",
    fontSize: 16,
    marginBottom: 40,
  },

  mainStat: {
    alignItems: "center",
    marginBottom: 40,
  },

  distance: {
    fontSize: 72,
    fontWeight: "800",
  },

  km: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666666",
    marginTop: -8,
  },

  statsContainer: {
    gap: 12,
    marginBottom: 40,
  },

  statCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777777",
    marginBottom: 6,
  },

  value: {
    fontSize: 28,
    fontWeight: "700",
  },

  unit: {
    color: "#777777",
    marginTop: 2,
  },

  doneButton: {
    backgroundColor: "#20C96B",
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
