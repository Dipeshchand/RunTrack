import { router } from "expo-router";
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

import { useRunTracking } from "../hooks/useRunTracking";

export default function RunScreen() {
  const {
    isTracking,
    isPaused,
    currentLocation,
    locationPoints,
    distance,
    elapsedTime,
    pace,

    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useRunTracking();

  // --------------------------------
  // TIME FORMAT
  // --------------------------------

  const formatTime = (seconds: number) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // --------------------------------
  // PACE FORMAT
  // --------------------------------

  const formatPace = (
    paceSeconds: number | null
  ) => {
    if (
      !paceSeconds ||
      paceSeconds <= 0
    ) {
      return "--:--";
    }

    const minutes = Math.floor(
      paceSeconds / 60
    );

    const seconds = Math.floor(
      paceSeconds % 60
    );

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // --------------------------------
  // STOP RUN
  // --------------------------------

  const handleStopRun = () => {
    // Capture all run information
    // before stopping tracking.

    const runData = {
      distance: String(distance),

      elapsedTime: String(
        elapsedTime
      ),

      pace: String(pace ?? 0),

      points: String(
        locationPoints.length
      ),

      // Save the complete GPS route
      route: JSON.stringify(
        locationPoints
      ),
    };

    // Stop GPS tracking
    stopTracking();

    // Go to Run Summary
    router.replace({
      pathname: "/run-summary",
      params: runData,
    });
  };

  // --------------------------------
  // MAP REGION
  // --------------------------------

  const mapRegion = currentLocation
    ? {
        latitude:
          currentLocation.latitude,

        longitude:
          currentLocation.longitude,

        latitudeDelta: 0.005,

        longitudeDelta: 0.005,
      }
    : {
        latitude: 13.056873,

        longitude: 77.589567,

        latitudeDelta: 0.01,

        longitudeDelta: 0.01,
      };

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          {isPaused
            ? "PAUSED"
            : isTracking
            ? "RUNNING 🟢"
            : "READY"}
        </Text>

        <Text style={styles.subtitle}>
          {currentLocation
            ? `GPS Accuracy: ${
                currentLocation.accuracy?.toFixed(
                  1
                ) ?? "--"
              } m`
            : "Waiting for GPS..."}
        </Text>
      </View>

      {/* STATS */}

      <View style={styles.statsContainer}>

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {(distance / 1000).toFixed(
              2
            )}
          </Text>

          <Text style={styles.statLabel}>
            KM
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {formatTime(elapsedTime)}
          </Text>

          <Text style={styles.statLabel}>
            TIME
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {formatPace(pace)}
          </Text>

          <Text style={styles.statLabel}>
            /KM
          </Text>
        </View>

      </View>

      {/* MAP */}

      <View style={styles.mapContainer}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          showsUserLocation
          showsMyLocationButton
        >

          {/* ROUTE */}

          {locationPoints.length > 0 && (
            <>
              <Polyline
                coordinates={locationPoints.map(
                  (point) => ({
                    latitude:
                      point.latitude,

                    longitude:
                      point.longitude,
                  })
                )}
                strokeWidth={5}
                strokeColor="#20C96B"
              />

              {/* START MARKER */}

              <Marker
                coordinate={{
                  latitude:
                    locationPoints[0]
                      .latitude,

                  longitude:
                    locationPoints[0]
                      .longitude,
                }}
                title="Start"
              />
            </>
          )}

          {/* CURRENT LOCATION */}

          {currentLocation && (
            <Marker
              coordinate={{
                latitude:
                  currentLocation.latitude,

                longitude:
                  currentLocation.longitude,
              }}
              title="You"
            />
          )}

        </MapView>

      </View>

      {/* BUTTONS */}

      <View style={styles.controls}>

        {/* START */}

        {!isTracking &&
          !isPaused && (
            <Pressable
              style={styles.startButton}
              onPress={startTracking}
            >
              <Text
                style={styles.buttonText}
              >
                START TRACKING
              </Text>
            </Pressable>
          )}

        {/* RUNNING */}

        {isTracking && (
          <>
            <Pressable
              style={styles.pauseButton}
              onPress={pauseTracking}
            >
              <Text
                style={styles.buttonText}
              >
                PAUSE RUN
              </Text>
            </Pressable>

            <Pressable
              style={styles.stopButton}
              onPress={handleStopRun}
            >
              <Text
                style={styles.buttonText}
              >
                STOP RUN
              </Text>
            </Pressable>
          </>
        )}

        {/* PAUSED */}

        {isPaused && (
          <>
            <Pressable
              style={styles.resumeButton}
              onPress={resumeTracking}
            >
              <Text
                style={styles.buttonText}
              >
                RESUME RUN
              </Text>
            </Pressable>

            <Pressable
              style={styles.stopButton}
              onPress={handleStopRun}
            >
              <Text
                style={styles.buttonText}
              >
                STOP RUN
              </Text>
            </Pressable>
          </>
        )}

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
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 5,
    color: "#777",
  },

  statsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 18,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 5,
  },

  mapContainer: {
    flex: 1,
    marginTop: 15,
    overflow: "hidden",
  },

  map: {
    flex: 1,
  },

  controls: {
    padding: 20,
    gap: 12,
  },

  startButton: {
    height: 55,
    backgroundColor: "#20C96B",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  pauseButton: {
    height: 55,
    backgroundColor: "#F59E0B",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  resumeButton: {
    height: 55,
    backgroundColor: "#20C96B",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  stopButton: {
    height: 55,
    backgroundColor: "#E53935",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});