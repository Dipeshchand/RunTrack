import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PreRunScreen() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let subscription:
      | Location.LocationSubscription
      | null = null;

    const startGPS = async () => {
      try {
        setLoading(true);
        setError(null);

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError(
            "Location permission is required to track your run."
          );
          setLoading(false);
          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        setLocation(currentLocation);

        subscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 5,
            },
            (newLocation) => {
              setLocation(newLocation);
            }
          );

        setLoading(false);
      } catch (error) {
        console.error(
          "Unable to get GPS:",
          error
        );

        setError(
          "Unable to get your location."
        );

        setLoading(false);
      }
    };

    startGPS();

    return () => {
      subscription?.remove();
    };
  }, []);

  const accuracy =
    location?.coords.accuracy;

  const gpsReady =
    location !== null;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Ready to Run?
      </Text>

      {/* GPS CARD */}
      <View style={styles.card}>
        <Text style={styles.pin}>
          📍
        </Text>

        <Text style={styles.gpsTitle}>
          GPS
        </Text>

        {loading ? (
          <>
            <Text style={styles.searching}>
              Searching for GPS...
            </Text>

            <Text style={styles.accuracy}>
              Please wait
            </Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.error}>
              GPS Error
            </Text>

            <Text style={styles.accuracy}>
              {error}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.ready}>
              GPS Found
            </Text>

            <Text style={styles.accuracy}>
              Accuracy:{" "}
              {accuracy !== null &&
              accuracy !== undefined
                ? `${accuracy.toFixed(1)} m`
                : "--"}
            </Text>
          </>
        )}
      </View>

      {/* CURRENT LOCATION */}
      {location && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>
            Current Location
          </Text>

          <Text style={styles.locationText}>
            Latitude:{" "}
            {location.coords.latitude.toFixed(
              6
            )}
          </Text>

          <Text style={styles.locationText}>
            Longitude:{" "}
            {location.coords.longitude.toFixed(
              6
            )}
          </Text>
        </View>
      )}

      {/* START RUN */}
      <Pressable
        style={[
          styles.startButton,
          !gpsReady &&
            styles.disabledButton,
        ]}
        disabled={!gpsReady}
        onPress={() => router.push("/run")}
      >
        <Text style={styles.buttonText}>
          START RUN
        </Text>
      </Pressable>

      {/* BACK */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          Go Back
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  pin: {
    fontSize: 42,
    marginBottom: 12,
  },

  gpsTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  ready: {
    color: "#20C96B",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  searching: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  accuracy: {
    color: "#777777",
    fontSize: 15,
  },

  error: {
    color: "#E53935",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },

  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  locationText: {
    fontSize: 15,
    color: "#555555",
    marginBottom: 6,
  },

  startButton: {
    backgroundColor: "#20C96B",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  disabledButton: {
    backgroundColor: "#BDBDBD",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  backButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  backText: {
    color: "#666666",
    fontSize: 15,
  },
});