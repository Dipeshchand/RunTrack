import { router, useFocusEffect } from "expo-router";
import MapView, {
  Polyline,
} from "react-native-maps";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useRef, useState } from "react";

import {
  getRuns,
  SavedRun,
} from "../utils/runStorage";

export default function HistoryScreen() {
  const [runs, setRuns] = useState<SavedRun[]>([]);

  // --------------------------------
  // LOAD SAVED RUNS
  // --------------------------------

  useFocusEffect(
    useCallback(() => {
      const loadRuns = async () => {
        const savedRuns = await getRuns();
        setRuns(savedRuns);
      };

      loadRuns();
    }, [])
  );

  // --------------------------------
  // FORMAT TIME
  // --------------------------------

  const formatTime = (seconds: number) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(
        minutes
      ).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    return `${minutes}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // --------------------------------
  // FORMAT PACE
  // --------------------------------

  const formatPace = (
    pace: number | null
  ) => {
    if (!pace || pace <= 0) {
      return "--:--";
    }

    const minutes = Math.floor(
      pace / 60
    );

    const seconds = Math.floor(
      pace % 60
    );

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // --------------------------------
  // FORMAT DATE
  // --------------------------------

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // --------------------------------
  // RUN CARD
  // --------------------------------

  const renderRun = ({
    item,
  }: {
    item: SavedRun;
  }) => {
    const coordinates =
      item.route?.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      })) ?? [];

    const hasRoute =
      coordinates.length >= 2;

    return (
      <Pressable
        style={styles.runCard}
        onPress={() =>
          router.push({
            pathname: "/run-details",
            params: {
              id: item.id,
            },
          })
        }
      >
        {/* -------------------------------- */}
        {/* MAP PREVIEW */}
        {/* -------------------------------- */}

        <View style={styles.mapContainer}>
          {hasRoute ? (
            <MapView
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              showsCompass={false}
              showsScale={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
              toolbarEnabled={false}
              initialRegion={{
                latitude:
                  coordinates[0].latitude,
                longitude:
                  coordinates[0].longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
            >
              <Polyline
                coordinates={coordinates}
                strokeWidth={4}
                strokeColor="#FF6347"
              />
            </MapView>
          ) : (
            <View style={styles.noRoute}>
              <Text style={styles.noRouteText}>
                No route available
              </Text>
            </View>
          )}
        </View>

        {/* -------------------------------- */}
        {/* RUN INFORMATION */}
        {/* -------------------------------- */}

        <View style={styles.runInfo}>

          {/* DATE + ARROW */}

          <View style={styles.topRow}>
            <Text style={styles.date}>
              {formatDate(item.date)}
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </View>

          {/* DISTANCE + TIME */}

          <View style={styles.mainStats}>

            <View>
              <Text style={styles.distance}>
                {(
                  item.distance / 1000
                ).toFixed(2)} km
              </Text>
            </View>

            <Text style={styles.time}>
              {formatTime(
                item.elapsedTime
              )}
            </Text>

          </View>

          {/* PACE */}

          <Text style={styles.pace}>
            {formatPace(item.pace)} /km
          </Text>

        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Your Runs
        </Text>

        <Pressable>
          <Text style={styles.filter}>
            ☰
          </Text>
        </Pressable>

      </View>

      {/* -------------------------------- */}
      {/* RUN LIST */}
      {/* -------------------------------- */}

      {runs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>
            🏃
          </Text>

          <Text style={styles.emptyTitle}>
            No runs yet
          </Text>

          <Text style={styles.emptyText}>
            Complete your first run and
            it will appear here.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={() =>
              router.push("/pre-run")
            }
          >
            <Text style={styles.startText}>
              START RUN
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={runs}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={renderRun}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.list
          }
        />
      )}

      {/* -------------------------------- */}
      {/* BOTTOM NAVIGATION */}
      {/* -------------------------------- */}

      <View style={styles.bottomNav}>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace("/home")
          }
        >
          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navText}>
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
        >
          <Text style={styles.activeIcon}>
            🏃
          </Text>

          <Text style={styles.activeText}>
            Runs
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace("/stats")
          }
        >
          <Text style={styles.navIcon}>
            ▥
          </Text>

          <Text style={styles.navText}>
            Stats
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace(
              "/profile-view"
            )
          }
        >
          <Text style={styles.navIcon}>
            ◯
          </Text>

          <Text style={styles.navText}>
            Profile
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
    paddingTop: 50,
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  filter: {
    fontSize: 22,
    color: "#555",
  },

  // --------------------------------
  // LIST
  // --------------------------------

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // --------------------------------
  // RUN CARD
  // --------------------------------

  runCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 15,
    overflow: "hidden",
  },

  // --------------------------------
  // MAP
  // --------------------------------

  mapContainer: {
    height: 145,
    backgroundColor: "#E7E7E7",
  },

  map: {
    flex: 1,
  },

  noRoute: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  noRouteText: {
    color: "#888",
    fontSize: 13,
  },

  // --------------------------------
  // RUN INFO
  // --------------------------------

  runInfo: {
    padding: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  date: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },

  arrow: {
    fontSize: 24,
    color: "#999",
  },

  mainStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  distance: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  time: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },

  pace: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
    fontWeight: "600",
  },

  // --------------------------------
  // EMPTY
  // --------------------------------

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 6,
  },

  startButton: {
    backgroundColor: "#20C96B",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },

  startText: {
    color: "#fff",
    fontWeight: "800",
  },

  // --------------------------------
  // BOTTOM NAV
  // --------------------------------

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 75,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    color: "#888",
  },

  activeIcon: {
    fontSize: 20,
    color: "#20C96B",
  },

  navText: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
  },

  activeText: {
    fontSize: 11,
    color: "#20C96B",
    fontWeight: "700",
    marginTop: 3,
  },
});