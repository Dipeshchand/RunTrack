import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export type LocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export function useRunTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<LocationPoint | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  const startTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      setLocationPoints([]);
      setCurrentLocation(null);
      setIsTracking(true);

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (location) => {
            const point: LocationPoint = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              timestamp: location.timestamp,
            };

            setCurrentLocation(point);

            setLocationPoints((previousPoints) => [
              ...previousPoints,
              point,
            ]);
          }
        );
    } catch (error) {
      console.error("Unable to start tracking:", error);
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
    setIsTracking(false);
  };

  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  return {
    isTracking,
    locationPoints,
    currentLocation,
    startTracking,
    stopTracking,
  };
}