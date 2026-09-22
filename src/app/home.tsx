import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getRuns,
  SavedRun,
} from "../utils/runStorage";

import {
  getProfile,
  Profile,
} from "../utils/profileStorage";

export default function HomeScreen() {
  const [runs, setRuns] =
    useState<SavedRun[]>([]);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  // ======================================
  // LOAD RUNS + PROFILE
  // ======================================

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedRuns = await getRuns();
        const savedProfile = await getProfile();

        setRuns(savedRuns);
        setProfile(savedProfile);
      };

      loadData();
    }, [])
  );

  // ======================================
  // PROFILE NAME
  // ======================================

  const profileName =
    profile?.name?.trim() || "Runner";

  const profileInitial =
    profileName.charAt(0).toUpperCase();

  // ======================================
  // FORMAT TIME
  // ======================================

  const formatTime = (
    seconds: number
  ) => {
    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    if (hours > 0) {
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
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // ======================================
  // FORMAT PACE
  // ======================================

  const formatPace = (
    pace: number | null
  ) => {
    if (!pace || pace <= 0) {
      return "--:--";
    }

    const minutes =
      Math.floor(pace / 60);

    const seconds =
      Math.floor(pace % 60);

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // ======================================
  // FORMAT DATE
  // ======================================

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  // ======================================
  // WEEK START
  // ======================================

  const getStartOfWeek = () => {
    const now = new Date();

    const day = now.getDay();

    const diff =
      day === 0
        ? -6
        : 1 - day;

    const start = new Date(now);

    start.setDate(
      now.getDate() + diff
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    return start;
  };

  const startOfWeek =
    getStartOfWeek();

  const weeklyRuns =
    runs.filter(
      (run) =>
        new Date(run.date) >=
        startOfWeek
    );

  const weeklyDistance =
    weeklyRuns.reduce(
      (total, run) =>
        total + run.distance,
      0
    );

  const weeklyDistanceKm =
    weeklyDistance / 1000;

  const averagePace =
    weeklyRuns.length > 0
      ? weeklyRuns.reduce(
          (total, run) =>
            total + (run.pace ?? 0),
          0
        ) / weeklyRuns.length
      : null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              Good Morning
            </Text>

            <Text style={styles.title}>
              {profileName} 👋
            </Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              {profileInitial}
            </Text>
          </View>
        </View>

        {/* WEEKLY STATS */}

        <Text style={styles.sectionTitle}>
          This Week
        </Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {weeklyDistanceKm.toFixed(1)}
            </Text>

            <Text style={styles.statLabel}>
              KM
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {weeklyRuns.length}
            </Text>

            <Text style={styles.statLabel}>
              Runs
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatPace(averagePace)}
            </Text>

            <Text style={styles.statLabel}>
              Avg Pace
            </Text>
          </View>
        </View>

        {/* START RUN */}

        <Pressable
          style={styles.startButton}
          onPress={() =>
            router.push("/pre-run")
          }
        >
          <Text style={styles.startButtonText}>
            START RUN
          </Text>
        </Pressable>

        {/* RECENT RUNS */}

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>
            Recent Runs
          </Text>

          {runs.length > 0 && (
            <Pressable
              onPress={() =>
                router.push("/history")
              }
            >
              <Text style={styles.seeAll}>
                See All
              </Text>
            </Pressable>
          )}
        </View>

        {runs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              🏃
            </Text>

            <Text style={styles.emptyTitle}>
              No runs yet
            </Text>

            <Text style={styles.emptyText}>
              Complete your first run and
              it will appear here.
            </Text>
          </View>
        ) : (
          runs
            .slice(0, 3)
            .map((run) => (
              <Pressable
                key={run.id}
                style={styles.runCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/run-details",
                    params: {
                      id: run.id,
                    },
                  })
                }
              >
                <View>
                  <Text style={styles.runDate}>
                    {formatDate(run.date)}
                  </Text>

                  <Text style={styles.runDistance}>
                    {(run.distance / 1000).toFixed(
                      2
                    )}{" "}
                    km
                  </Text>
                </View>

                <View style={styles.runRight}>
                  <Text style={styles.runTime}>
                    {formatTime(
                      run.elapsedTime
                    )}
                  </Text>

                  <Text style={styles.runPace}>
                    {formatPace(run.pace)} /km
                  </Text>
                </View>
              </Pressable>
            ))
        )}

        {/* NAVIGATION */}

        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem}>
            <Text style={styles.navIcon}>
              🏠
            </Text>

            <Text style={styles.activeNavText}>
              Home
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              router.push("/history")
            }
          >
            <Text style={styles.navIcon}>
              🏃
            </Text>

            <Text style={styles.navText}>
              Runs
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              router.push("/stats")
            }
          >
            <Text style={styles.navIcon}>
              📊
            </Text>

            <Text style={styles.navText}>
              Stats
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() =>
              router.push("/profile-view")
            }
          >
            <Text style={styles.navIcon}>
              👤
            </Text>

            <Text style={styles.navText}>
              Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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

  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  smallText: {
    fontSize: 15,
    color: "#777",
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#20C96B",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#ddd",
  },

  startButton: {
    height: 58,
    backgroundColor: "#20C96B",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  startButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  seeAll: {
    color: "#20C96B",
    fontWeight: "700",
  },

  runCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  runDate: {
    color: "#777",
    fontSize: 13,
    marginBottom: 5,
  },

  runDistance: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  runRight: {
    alignItems: "flex-end",
  },

  runTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  runPace: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
  },

  bottomNav: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  navText: {
    fontSize: 11,
    color: "#777",
  },

  activeNavText: {
    fontSize: 11,
    color: "#20C96B",
    fontWeight: "700",
  },
});