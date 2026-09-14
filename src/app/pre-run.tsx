import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function PreRunScreen() {
  const [status, setStatus] = useState("Checking location...");
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null,
  );

  useEffect(() => {
    checkLocation();

    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  const checkLocation = async () => {
    try {
      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== "granted") {
        setStatus("Location permission denied");

        Alert.alert(
          "Location Permission",
          "Please allow location access to track your run.",
        );

        return;
      }

      setStatus("Searching for GPS...");

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const currentAccuracy = location.coords.accuracy;

          setAccuracy(currentAccuracy);

          if (currentAccuracy !== null && currentAccuracy <= 20) {
            setStatus("GPS Ready");
          } else {
            setStatus("GPS Found");
          }
        },
      );
    } catch (error) {
      console.error("GPS error:", error);
      setStatus("Unable to get GPS");
    }
  };

  const handleStartRun = () => {
    // Stop the GPS watcher on the Pre-Run screen.
    locationSubscription.current?.remove();
    locationSubscription.current = null;

    // Go to the actual running screen.
    router.push("/run");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View>
        <Text style={styles.title}>Ready to Run?</Text>

        <Text style={styles.subtitle}>
          Make sure you're in an open area for better GPS accuracy.
        </Text>
      </View>

      {/* GPS Card */}
      <View style={styles.gpsCard}>
        <View style={styles.gpsIconContainer}>
          <Text style={styles.gpsIcon}>📍</Text>
        </View>

        <Text style={styles.gpsTitle}>GPS</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              status === "GPS Ready" ? styles.readyDot : styles.searchingDot,
            ]}
          />

          <Text style={styles.gpsStatus}>{status}</Text>
        </View>

        <Text style={styles.accuracy}>
          Accuracy: {accuracy !== null ? `${accuracy.toFixed(1)} m` : "--"}
        </Text>
      </View>

      {/* Initial Metrics */}
      <View style={styles.metricsCard}>
        <View style={styles.metric}>
          <Text style={styles.value}>0.00</Text>
          <Text style={styles.label}>Kilometers</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.value}>00:00</Text>
          <Text style={styles.label}>Time</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.value}>--:--</Text>
          <Text style={styles.label}>Pace /km</Text>
        </View>
      </View>

      {/* Start Run Button */}
      <Pressable
        style={[
          styles.startButton,
          status === "Searching for GPS..." && styles.disabledButton,
        ]}
        onPress={handleStartRun}
        disabled={status === "Searching for GPS..."}
      >
        <Text style={styles.startButtonText}>START RUN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
    lineHeight: 20,
  },

  gpsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",
  },

  gpsIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
  },

  gpsIcon: {
    fontSize: 28,
  },

  gpsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginTop: 10,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  readyDot: {
    backgroundColor: "#20C96B",
  },

  searchingDot: {
    backgroundColor: "#F5A623",
  },

  gpsStatus: {
    fontSize: 16,
    fontWeight: "700",
    color: "#20C96B",
  },

  accuracy: {
    fontSize: 14,
    color: "#777777",
    marginTop: 5,
  },

  metricsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 24,
    flexDirection: "row",
  },

  metric: {
    flex: 1,
    alignItems: "center",
  },

  value: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111111",
  },

  label: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },

  startButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: "#20C96B",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#A8DDBD",
  },

  startButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
