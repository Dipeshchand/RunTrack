import AsyncStorage from "@react-native-async-storage/async-storage";

const RUNS_KEY = "@runtrack_runs";

export type SavedRun = {
  id: string;
  distance: number;
  elapsedTime: number;
  pace: number | null;
  points: number;
  date: string;
};

// ======================================
// GET ALL RUNS
// ======================================

export const getRuns =
  async (): Promise<SavedRun[]> => {
    try {
      const storedRuns =
        await AsyncStorage.getItem(
          RUNS_KEY
        );

      if (!storedRuns) {
        return [];
      }

      const parsedRuns =
        JSON.parse(storedRuns);

      if (!Array.isArray(parsedRuns)) {
        return [];
      }

      return parsedRuns;
    } catch (error) {
      console.error(
        "Unable to get runs:",
        error
      );

      return [];
    }
  };

// ======================================
// SAVE RUN
// ======================================

export const saveRun = async (
  run: SavedRun
): Promise<void> => {
  try {
    const existingRuns =
      await getRuns();

    const updatedRuns = [
      run,
      ...existingRuns,
    ];

    await AsyncStorage.setItem(
      RUNS_KEY,
      JSON.stringify(
        updatedRuns
      )
    );
  } catch (error) {
    console.error(
      "Unable to save run:",
      error
    );
  }
};

// ======================================
// GET RUN BY ID
// ======================================

export const getRunById = async (
  id: string
): Promise<SavedRun | null> => {
  try {
    const runs =
      await getRuns();

    const run =
      runs.find(
        (item) =>
          item.id === id
      );

    return run ?? null;
  } catch (error) {
    console.error(
      "Unable to get run:",
      error
    );

    return null;
  }
};

// ======================================
// CLEAR RUNS
// ======================================

export const clearRuns =
  async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(
        RUNS_KEY
      );
    } catch (error) {
      console.error(
        "Unable to clear runs:",
        error
      );
    }
  };