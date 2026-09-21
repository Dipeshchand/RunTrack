import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useEffect, useState } from "react";

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getRunById,
  SavedRun,
} from "../utils/runStorage";

export default function RunDetailsScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [run, setRun] =
    useState<SavedRun | null>(null);

  const [loading, setLoading] =
    useState(true);

  // --------------------------------
  // LOAD RUN
  // --------------------------------

  useEffect(() => {
    const loadRun = async () => {
      try {
        if (!id) {
          return;
        }

        const savedRun =
          await getRunById(id);

        setRun(savedRun);
      } catch (error) {
        console.error(
          "Unable to load run:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadRun();
  }, [id]);

  // --------------------------------
  // TIME FORMAT
  // --------------------------------

  const formatTime = (
    seconds: number
  ) => {
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
  // DATE FORMAT
  // --------------------------------

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString();
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
        />

        <Text style={styles.loadingText}>
          Loading run...
        </Text>
      </View>
    );
  }

  // --------------------------------
  // RUN NOT FOUND
  // --------------------------------

  if (!run) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Run not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.backButtonText}
          >
            GO BACK
          </Text>
        </Pressable>
      </View>
    );
  }

  // --------------------------------
  // ROUTE
  // --------------------------------

  const routeCoordinates =
    run.route?.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })) ?? [];

  // --------------------------------
  // MAP REGION
  // --------------------------------

  const firstPoint =
    routeCoordinates[0];

  const mapRegion = firstPoint
    ? {
        latitude:
          firstPoint.latitude,

        longitude:
          firstPoint.longitude,

        latitudeDelta: 0.01,

        longitudeDelta: 0.01,
      }
    : {
        latitude: 13.056873,

        longitude: 77.589567,

        latitudeDelta: 0.01,

        longitudeDelta: 0.01,
      };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.backText}
          >
            ← Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Run Details
        </Text>

        <Text style={styles.date}>
          {formatDate(run.date)}
        </Text>
      </View>

      {/* DISTANCE */}

      <View
        style={styles.distanceCard}
      >
        <Text
          style={styles.distanceLabel}
        >
          DISTANCE
        </Text>

        <Text style={styles.distance}>
          {(
            run.distance / 1000
          ).toFixed(2)}
        </Text>

        <Text style={styles.km}>
          KM
        </Text>
      </View>

      {/* STATS */}

      <View style={styles.statsCard}>

        <View style={styles.stat}>
          <Text
            style={styles.statLabel}
          >
            TIME
          </Text>

          <Text
            style={styles.statValue}
          >
            {formatTime(
              run.elapsedTime
            )}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text
            style={styles.statLabel}
          >
            PACE
          </Text>

          <Text
            style={styles.statValue}
          >
            {formatPace(run.pace)}
          </Text>

          <Text style={styles.unit}>
            /km
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text
            style={styles.statLabel}
          >
            GPS POINTS
          </Text>

          <Text
            style={styles.statValue}
          >
            {run.points}
          </Text>
        </View>

      </View>

      {/* ROUTE MAP */}

      <View style={styles.mapContainer}>

        {routeCoordinates.length > 0 ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={
              mapRegion
            }
          >

            {/* ROUTE LINE */}

            <Polyline
              coordinates={
                routeCoordinates
              }
              strokeWidth={5}
              strokeColor="#20C96B"
            />

            {/* START */}

            <Marker
              coordinate={
                routeCoordinates[0]
              }
              title="Start"
            />

            {/* FINISH */}

            {routeCoordinates.length >
              1 && (
              <Marker
                coordinate={
                  routeCoordinates[
                    routeCoordinates.length -
                      1
                  ]
                }
                title="Finish"
              />
            )}

          </MapView>
        ) : (
          <View
            style={
              styles.noRoute
            }
          >
            <Text
              style={
                styles.noRouteTitle
              }
            >
              No Route Available
            </Text>

            <Text
              style={
                styles.noRouteText
              }
            >
              This run doesn't have
              GPS route data.
            </Text>
          </View>
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9F8",
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    color: "#777",
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 20,
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  backText: {
    fontSize: 16,
    color: "#20C96B",
    fontWeight: "700",
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  date: {
    marginTop: 5,
    color: "#777",
    fontSize: 14,
  },

  distanceCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
  },

  distanceLabel: {
    fontSize: 11,
    color: "#777",
    fontWeight: "700",
    letterSpacing: 1,
  },

  distance: {
    fontSize: 46,
    fontWeight: "800",
    color: "#20C96B",
    marginTop: 5,
  },

  km: {
    color: "#777",
    fontWeight: "700",
  },

  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 10,
    color: "#888",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111",
  },

  unit: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#ddd",
  },

  mapContainer: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
  },

  map: {
    flex: 1,
  },

  noRoute: {
    flex: 1,
    backgroundColor: "#EDEDE8",
    alignItems: "center",
    justifyContent: "center",
  },

  noRouteTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  noRouteText: {
    marginTop: 8,
    color: "#777",
  },

  backButton: {
    backgroundColor: "#20C96B",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});