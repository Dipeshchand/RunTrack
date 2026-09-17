import AsyncStorage from "@react-native-async-storage/async-storage";
const RUNS_KEY = "@runtrack_runs";

// runkey is the name of the storage 

export type SavedRun = {
    id: string;
    distance: number,
    elapsedTime: number;
    pace: number | null;
    points: number;
    date: string;
}

/*
 * Get all saved runs
 */

export const getRuns = async (): Promise<SavedRun[]> => {
    try {
        const storedRuns = await AsyncStorage.getItem(RUNS_KEY);
        if (!storedRuns) {
            return [];
        }
        return JSON.parse(storedRuns);
    } catch (error) {
        console.error(
            "Unable to get runs",
            error
        );
        return []
    }
};

/*
 * Save a new run
 */

export const saveRun = async (run: SavedRun): Promise<void> => {
    try {
        const existingRuns = await getRuns();
        const updatedRuns = [
            run,
            ...existingRuns,
        ];
        await AsyncStorage.setItem(
            RUNS_KEY,
            JSON.stringify(updatedRuns)
        );
    } catch (error) {
        console.error("Unable to save run", error);
    }
}

/*
 * Delete all runs
 *
 * We'll use this later for testing/settings.
 */

export const clearRuns = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(RUNS_KEY);
    } catch (error) {
        console.error("Unable to clear runs:",
            error
        );
    }
};