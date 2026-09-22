import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "@runtrack_profile";

export type Profile = {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
};

export const saveProfile = async (profile: Profile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Unable to save profile:", error);
  }
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(storedProfile);
  } catch (error) {
    console.error("Unable to get profile:", error);
    return null;
  }
};

export const clearProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Unable to clear profile:", error);
  }
};