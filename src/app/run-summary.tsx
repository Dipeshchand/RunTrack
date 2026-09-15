import { useLocalSearchParams } from "expo-router";

export default function RunSummaryScreen() {
  const { distance, elapsedTime, pace, points } = useLocalSearchParams<{
    distance: string;
    elapsedTime: string;
    pace: string;
    points: string;
  }>();
}
