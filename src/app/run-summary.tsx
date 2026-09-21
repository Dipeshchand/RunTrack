import { router, useLocalSearchParams } from "expo-router";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { saveRun } from "../utils/runStorage";

type RoutePoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export default function RunSummaryScreen() {
  const {
    distance,
    elapsedTime,
    pace,
    points,
    route,
  } = useLocalSearchParams<{
    distance: string;
    elapsedTime: string;
    pace: string;
    points: string;
    route: string;
  }>();

  // -----------------------------
  // RUN DATA
  // -----------------------------

  const distanceInMeters = Number(distance) || 0;
  const totalElapsedTime = Number(elapsedTime) || 0;
  const totalPace = Number(pace) || 0;
  const totalPoints = Number(points) || 0;

  // -----------------------------
  // ROUTE DATA
  // -----------------------------

  let routePoints: RoutePoint[] = [];

  try {
    if (route) {
      routePoints = JSON.parse(route);
    }
  } catch (error) {
    console.log("Route parsing error:", error);
  }

  // -----------------------------
  // MAP COORDINATES
  // -----------------------------

  const coordinates = routePoints.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  // -----------------------------
  // TIME FORMAT
  // -----------------------------

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // -----------------------------
  // PACE FORMAT
  // -----------------------------

  const formatPace = (paceSeconds: number) => {
    if (!paceSeconds || paceSeconds <= 0) {
      return "--:--";
    }

    const minutes = Math.floor(paceSeconds / 60);

    const seconds = Math.floor(
      paceSeconds % 60
    );

    return `${minutes}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // -----------------------------
  // SAVE RUN
  // -----------------------------

  const handleSaveRun = async () => {
    const newRun = {
      id: Date.now().toString(),

      distance: distanceInMeters,

      elapsedTime: totalElapsedTime,

      pace: totalPace > 0 ? totalPace : null,

      points: totalPoints,

      date: new Date().toISOString(),

      route: routePoints,
    };

    await saveRun(newRun);

    router.replace("/home");
  };

  // -----------------------------
  // DISCARD
  // -----------------------------

  const handleDiscard = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Run Completed! 🎉
        </Text>

        <Text style={styles.subtitle}>
          Great job! Here's your run.
        </Text>
      </View>

      {/* ROUTE MAP */}

      <View style={styles.mapContainer}>
        {coordinates.length >= 2 ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            initialRegion={{
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* RUNNING ROUTE */}

            <Polyline
              coordinates={coordinates}
              strokeWidth={5}
              strokeColor="#20C96B"
            />

            {/* START */}

            <Marker
              coordinate={coordinates[0]}
              title="Start"
            />

            {/* FINISH */}

            <Marker
              coordinate={
                coordinates[coordinates.length - 1]
              }
              title="Finish"
            />
          </MapView>
        ) : (
          <View style={styles.noMap}>
            <Text style={styles.noMapText}>
              Not enough GPS data for route
            </Text>
          </View>
        )}
      </View>

      {/* DISTANCE */}

      <View style={styles.distanceSection}>
        <Text style={styles.distanceLabel}>
          DISTANCE
        </Text>

        <View style={styles.distanceRow}>
          <Text style={styles.distance}>
            {(distanceInMeters / 1000).toFixed(2)}
          </Text>

          <Text style={styles.km}>
            KM
          </Text>
        </View>
      </View>

      {/* TIME + PACE */}

      <View style={styles.statsCard}>
        {/* TIME */}

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            TIME
          </Text>

          <Text style={styles.statValue}>
            {formatTime(totalElapsedTime)}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* PACE */}

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            AVG PACE
          </Text>

          <Text style={styles.statValue}>
            {formatPace(totalPace)}
          </Text>

          <Text style={styles.unit}>
            /km
          </Text>
        </View>
      </View>

      {/* GPS INFO */}

      <View style={styles.routeInfo}>
        <Text style={styles.routeInfoTitle}>
          GPS ROUTE
        </Text>

        <Text style={styles.routeInfoText}>
          {routePoints.length} GPS points captured
        </Text>
      </View>

      {/* BUTTONS */}

      <View style={styles.buttons}>
        <Pressable
          style={styles.saveButton}
          onPress={handleSaveRun}
        >
          <Text style={styles.saveButtonText}>
            SAVE RUN
          </Text>
        </Pressable>

        <Pressable
          style={styles.discardButton}
          onPress={handleDiscard}
        >
          <Text style={styles.discardButtonText}>
            DISCARD
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  // HEADER

  header: {
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  // MAP

  mapContainer: {
    height: 270,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E5E5E5",
    marginBottom: 14,
  },

  map: {
    flex: 1,
  },

  noMap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  noMapText: {
    color: "#777",
    fontSize: 14,
  },

  // DISTANCE

  distanceSection: {
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
  },

  distanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888",
    letterSpacing: 1,
  },

  distanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  distance: {
    fontSize: 40,
    fontWeight: "800",
    color: "#20C96B",
  },

  km: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    marginLeft: 5,
  },

  // STATS

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "700",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  unit: {
    fontSize: 10,
    color: "#777",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#DDD",
  },

  // GPS

  routeInfo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  routeInfoTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888",
  },

  routeInfoText: {
    fontSize: 13,
    color: "#333",
    marginTop: 3,
  },

  // BUTTONS

  buttons: {
    gap: 8,
  },

  saveButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#20C96B",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  discardButton: {
    height: 42,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },

  discardButtonText: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "700",
  },
});