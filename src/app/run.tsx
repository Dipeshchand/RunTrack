import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { useRunTracking } from "../hooks/useRunTracking";

export default function RunScreen() {
  const {
    isTracking,
    isPaused,
    currentLocation,
    locationPoints,
    distance,
    pace,
    elapsedTime,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useRunTracking();

  const distanceInKilometers = distance / 1000;

  const mapRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : undefined;

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
   * Convert seconds/km into MM:SS
   */
  const formatPace = (paceSeconds: number | null) => {
    if (paceSeconds === null || !Number.isFinite(paceSeconds)) {
      return "--:--";
    }

    const minutes = Math.floor(paceSeconds / 60);

    const seconds = Math.floor(paceSeconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * Stop the run and send
   * the data to Run Summary.
   */
  const handleStopRun = () => {
    stopTracking();

    router.replace({
      pathname: "/run-summary",

      params: {
        distance: distance.toString(),

        elapsedTime: elapsedTime.toString(),

        pace: pace?.toString() ?? "0",

        points: locationPoints.length.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* STATUS */}
      <Text style={styles.title}>
        {isPaused ? "PAUSED ⏸️" : isTracking ? "RUNNING 🟢" : "READY"}
      </Text>

      {/* DISTANCE */}
      <View style={styles.distanceContainer}>
        <Text style={styles.distance}>{distanceInKilometers.toFixed(2)}</Text>

        <Text style={styles.km}>KM</Text>
      </View>

      {/* TIME */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>TIME</Text>

        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      </View>

      {/* PACE */}
      <View style={styles.paceContainer}>
        <Text style={styles.paceLabel}>PACE</Text>

        <Text style={styles.pace}>{formatPace(pace)} /km</Text>
      </View>

      {/* MAP */}
      {currentLocation && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* ROUTE */}
            {locationPoints.length > 1 && (
              <Polyline
                coordinates={locationPoints.map((point) => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeWidth={5}
              />
            )}

            {/* CURRENT POSITION */}
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,

                longitude: currentLocation.longitude,
              }}
              title="You"
            />
          </MapView>
        </View>
      )}

      {/* GPS POINTS */}
      <Text style={styles.points}>GPS Points: {locationPoints.length}</Text>

      {/* GPS DETAILS */}
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

      {/* BUTTONS */}

      {isPaused ? (
        <>
          {/* RESUME */}
          <Pressable style={styles.startButton} onPress={resumeTracking}>
            <Text style={styles.buttonText}>RESUME RUN</Text>
          </Pressable>

          {/* STOP */}
          <Pressable style={styles.stopButton} onPress={handleStopRun}>
            <Text style={styles.buttonText}>STOP RUN</Text>
          </Pressable>
        </>
      ) : isTracking ? (
        <>
          {/* PAUSE */}
          <Pressable style={styles.pauseButton} onPress={pauseTracking}>
            <Text style={styles.buttonText}>PAUSE RUN</Text>
          </Pressable>

          {/* STOP */}
          <Pressable style={styles.stopButton} onPress={handleStopRun}>
            <Text style={styles.buttonText}>STOP RUN</Text>
          </Pressable>
        </>
      ) : (
        /* START */
        <Pressable style={styles.startButton} onPress={startTracking}>
          <Text style={styles.buttonText}>START TRACKING</Text>
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

  paceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  paceLabel: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "600",
    marginBottom: 4,
  },

  pace: {
    fontSize: 28,
    fontWeight: "700",
  },

  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  map: {
    width: "100%",
    height: "100%",
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
    marginBottom: 12,
  },

  pauseButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  stopButton: {
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
