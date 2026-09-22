import { router, useFocusEffect } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useMemo, useState } from "react";

import {
  getRuns,
  SavedRun,
} from "../utils/runStorage";

type Period = "week" | "month" | "year";

export default function StatsScreen() {
  const [runs, setRuns] = useState<SavedRun[]>([]);
  const [period, setPeriod] =
    useState<Period>("week");

  // --------------------------------
  // LOAD RUNS
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
  // DATE HELPERS
  // --------------------------------

  const startOfWeek = (date: Date) => {
    const result = new Date(date);

    const day = result.getDay();

    // Monday = first day
    const difference =
      day === 0 ? 6 : day - 1;

    result.setDate(
      result.getDate() - difference
    );

    result.setHours(0, 0, 0, 0);

    return result;
  };

  const startOfMonth = (date: Date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
  };

  const startOfYear = (date: Date) => {
    return new Date(
      date.getFullYear(),
      0,
      1,
      0,
      0,
      0,
      0
    );
  };

  // --------------------------------
  // FILTER RUNS
  // --------------------------------

  const filteredRuns = useMemo(() => {
    const now = new Date();

    let startDate: Date;

    if (period === "week") {
      startDate = startOfWeek(now);
    } else if (period === "month") {
      startDate = startOfMonth(now);
    } else {
      startDate = startOfYear(now);
    }

    return runs.filter((run) => {
      const runDate = new Date(run.date);

      return runDate >= startDate;
    });
  }, [runs, period]);

  // --------------------------------
  // TOTAL DISTANCE
  // --------------------------------

  const totalDistance = useMemo(() => {
    return filteredRuns.reduce(
      (total, run) =>
        total + run.distance,
      0
    );
  }, [filteredRuns]);

  // --------------------------------
  // TOTAL TIME
  // --------------------------------

  const totalTime = useMemo(() => {
    return filteredRuns.reduce(
      (total, run) =>
        total + run.elapsedTime,
      0
    );
  }, [filteredRuns]);

  // --------------------------------
  // AVERAGE PACE
  // --------------------------------

  const averagePace = useMemo(() => {
    const runsWithPace =
      filteredRuns.filter(
        (run) =>
          run.pace !== null &&
          run.pace > 0
      );

    if (runsWithPace.length === 0) {
      return null;
    }

    /*
      Weighted average pace:

      total time
      ------------
      total distance

      This is more accurate than simply
      averaging each run's pace.
    */

    const totalDistanceMeters =
      runsWithPace.reduce(
        (total, run) =>
          total + run.distance,
        0
      );

    const totalSeconds =
      runsWithPace.reduce(
        (total, run) =>
          total + run.elapsedTime,
        0
      );

    if (totalDistanceMeters <= 0) {
      return null;
    }

    return (
      totalSeconds /
      (totalDistanceMeters / 1000)
    );
  }, [filteredRuns]);

  // --------------------------------
  // BEST RUN
  // --------------------------------

  const bestRun = useMemo(() => {
    if (filteredRuns.length === 0) {
      return null;
    }

    return filteredRuns.reduce(
      (best, run) => {
        if (!best) return run;

        return run.distance >
          best.distance
          ? run
          : best;
      },
      null as SavedRun | null
    );
  }, [filteredRuns]);

  // --------------------------------
  // WEEKLY CHART
  // --------------------------------

  const weeklyChart = useMemo(() => {
    const today = new Date();

    const weekStart =
      startOfWeek(today);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(
        weekStart
      );

      date.setDate(
        weekStart.getDate() + i
      );

      const nextDate = new Date(date);

      nextDate.setDate(
        date.getDate() + 1
      );

      const distance = runs
        .filter((run) => {
          const runDate = new Date(
            run.date
          );

          return (
            runDate >= date &&
            runDate < nextDate
          );
        })
        .reduce(
          (total, run) =>
            total + run.distance,
          0
        );

      days.push({
        date,
        distance:
          distance / 1000,
      });
    }

    return days;
  }, [runs]);

  const maxChartDistance =
    Math.max(
      ...weeklyChart.map(
        (day) => day.distance
      ),
      1
    );

  // --------------------------------
  // FORMAT PACE
  // --------------------------------

  const formatPace = (
    seconds: number | null
  ) => {
    if (
      seconds === null ||
      seconds <= 0
    ) {
      return "--:--";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // --------------------------------
  // FORMAT TOTAL TIME
  // --------------------------------

  const formatTotalTime = (
    seconds: number
  ) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  // --------------------------------
  // PERIOD LABEL
  // --------------------------------

  const periodLabel =
    period === "week"
      ? "This Week"
      : period === "month"
      ? "This Month"
      : "This Year";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Your Stats
          </Text>
        </View>

        {/* PERIOD TABS */}

        <View style={styles.tabs}>
          <PeriodButton
            label="Week"
            active={period === "week"}
            onPress={() =>
              setPeriod("week")
            }
          />

          <PeriodButton
            label="Month"
            active={period === "month"}
            onPress={() =>
              setPeriod("month")
            }
          />

          <PeriodButton
            label="Year"
            active={period === "year"}
            onPress={() =>
              setPeriod("year")
            }
          />
        </View>

        {/* SUMMARY STATS */}

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {(
                totalDistance / 1000
              ).toFixed(1)}
            </Text>

            <Text style={styles.statUnit}>
              KM
            </Text>

            <Text style={styles.statLabel}>
              Distance
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {filteredRuns.length}
            </Text>

            <Text style={styles.statUnit}>
              RUNS
            </Text>

            <Text style={styles.statLabel}>
              Runs
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.stat}>
            <Text
              style={[
                styles.statValue,
                styles.paceValue,
              ]}
            >
              {formatPace(
                averagePace
              )}
            </Text>

            <Text style={styles.statUnit}>
              /KM
            </Text>

            <Text style={styles.statLabel}>
              Avg Pace
            </Text>
          </View>
        </View>

        {/* CHART */}

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>
              Weekly Distance
            </Text>

            <Text style={styles.periodText}>
              {periodLabel}
            </Text>
          </View>

          <View style={styles.chart}>
            {weeklyChart.map(
              (day, index) => {
                const barHeight =
                  day.distance === 0
                    ? 4
                    : Math.max(
                        10,
                        (day.distance /
                          maxChartDistance) *
                          125
                      );

                const dayName =
                  day.date.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  );

                return (
                  <View
                    key={index}
                    style={
                      styles.chartColumn
                    }
                  >
                    <Text
                      style={
                        styles.chartValue
                      }
                    >
                      {day.distance > 0
                        ? day.distance.toFixed(
                            1
                          )
                        : ""}
                    </Text>

                    <View
                      style={[
                        styles.bar,
                        {
                          height:
                            barHeight,
                          opacity:
                            day.distance ===
                            0
                              ? 0.2
                              : 1,
                        },
                      ]}
                    />

                    <Text
                      style={
                        styles.dayLabel
                      }
                    >
                      {dayName.charAt(0)}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* PERSONAL STATS */}

        <View style={styles.bottomStats}>
          {/* BEST RUN */}

          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>
              BEST RUN
            </Text>

            <Text style={styles.smallValue}>
              {bestRun
                ? `${(
                    bestRun.distance /
                    1000
                  ).toFixed(2)} km`
                : "--"}
            </Text>
          </View>

          {/* TOTAL TIME */}

          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>
              TOTAL TIME
            </Text>

            <Text style={styles.smallValue}>
              {formatTotalTime(
                totalTime
              )}
            </Text>
          </View>
        </View>

        {/* NO DATA */}

        {filteredRuns.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>
              🏃
            </Text>

            <Text style={styles.emptyTitle}>
              No runs yet
            </Text>

            <Text style={styles.emptyText}>
              Complete a run to see your
              statistics here.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}

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
          onPress={() =>
            router.replace(
              "/history"
            )
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
        >
          <Text style={styles.activeIcon}>
            ▥
          </Text>

          <Text style={styles.activeText}>
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
// PERIOD BUTTON
// ======================================

function PeriodButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.tab,
        active && styles.activeTab,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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

  content: {
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  // HEADER

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  // TABS

  tabs: {
    backgroundColor: "#E8ECEA",
    borderRadius: 14,
    padding: 4,
    flexDirection: "row",
    marginBottom: 15,
  },

  tab: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },

  activeTab: {
    backgroundColor: "#20C96B",
  },

  tabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "700",
  },

  activeTabText: {
    color: "#fff",
  },

  // MAIN STATS

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111",
  },

  paceValue: {
    fontSize: 19,
  },

  statUnit: {
    fontSize: 9,
    color: "#20C96B",
    fontWeight: "800",
    marginTop: 1,
  },

  statLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },

  verticalDivider: {
    width: 1,
    height: 45,
    backgroundColor: "#E2E2E2",
  },

  // CHART

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },

  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },

  periodText: {
    fontSize: 11,
    color: "#888",
  },

  chart: {
    height: 175,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },

  chartColumn: {
    height: 165,
    width: 32,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  chartValue: {
    fontSize: 8,
    color: "#777",
    marginBottom: 3,
  },

  bar: {
    width: 18,
    backgroundColor: "#20C96B",
    borderRadius: 7,
    minHeight: 4,
  },

  dayLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 6,
    fontWeight: "600",
  },

  // BOTTOM STATS

  bottomStats: {
    flexDirection: "row",
    gap: 12,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },

  smallLabel: {
    fontSize: 9,
    color: "#888",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  smallValue: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111",
    marginTop: 8,
  },

  // EMPTY

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginTop: 15,
  },

  emptyEmoji: {
    fontSize: 35,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },

  emptyText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },

  // BOTTOM NAV

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