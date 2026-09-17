import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const recentRuns = [
  {
    id: "1",
    date: "Sep 6",
    distance: "5.24 km",
    time: "32:18",
    pace: "6:10/km",
  },
  {
    id: "2",
    date: "Sep 3",
    distance: "10.02 km",
    time: "1:02:41",
    pace: "6:15/km",
  },
  {
    id: "3",
    date: "Aug 30",
    distance: "3.50 km",
    time: "22:10",
    pace: "6:20/km",
  },
];

export default function HomeScreen() {
  const { name } = useLocalSearchParams<{
    name: string;
  }>();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>{name || "Runner"} 👋</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileEmoji}>👤</Text>
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>This Week</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>27.4</Text>
              <Text style={styles.statUnit}>km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>6:12</Text>
              <Text style={styles.statUnit}>/km</Text>
              <Text style={styles.statLabel}>Avg Pace</Text>
            </View>
          </View>
        </View>

        {/* Start Run */}
        <Pressable
          style={styles.startButton}
          onPress={() => router.push("/pre-run")}
        >
          <Text style={styles.startIcon}>🏃</Text>
          <Text style={styles.startButtonText}>START RUN</Text>
        </Pressable>

        {/* Recent Runs */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Runs</Text>

          <Pressable onPress={() => router.push("/history")}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {recentRuns.map((run) => (
          <Pressable
            key={run.id}
            style={styles.runCard}
            onPress={() =>
              router.push({
                pathname: "/run-details",
                params: {
                  id: run.id,
                },
              })
            }
          >
            <View>
              <Text style={styles.runDate}>{run.date}</Text>
              <Text style={styles.runDistance}>{run.distance}</Text>
            </View>

            <View style={styles.runRight}>
              <Text style={styles.runTime}>{run.time}</Text>
              <Text style={styles.runPace}>{run.pace}</Text>
            </View>
          </Pressable>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.activeNavText}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.navIcon}>🏃</Text>
          <Text style={styles.navText}>Runs</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/stats")}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Stats</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile-view")}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9F8",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 17,
    color: "#666666",
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
    marginTop: 2,
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
  },

  profileEmoji: {
    fontSize: 24,
  },

  statsCard: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
  },

  statUnit: {
    fontSize: 12,
    color: "#666666",
    marginTop: -2,
  },

  statLabel: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },

  divider: {
    width: 1,
    height: 45,
    backgroundColor: "#E8E8E8",
  },

  startButton: {
    marginTop: 24,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#20C96B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  startIcon: {
    fontSize: 22,
  },

  startButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  recentHeader: {
    marginTop: 32,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAll: {
    color: "#20C96B",
    fontSize: 14,
    fontWeight: "600",
  },

  runCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  runDate: {
    fontSize: 13,
    color: "#888888",
    marginBottom: 5,
  },

  runDistance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },

  runRight: {
    alignItems: "flex-end",
  },

  runTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  runPace: {
    fontSize: 13,
    color: "#777777",
    marginTop: 4,
  },

  bottomSpace: {
    height: 30,
  },

  bottomNav: {
    height: 76,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  navIcon: {
    fontSize: 21,
  },

  activeNavText: {
    fontSize: 11,
    color: "#20C96B",
    fontWeight: "700",
  },

  navText: {
    fontSize: 11,
    color: "#777777",
  },
});
