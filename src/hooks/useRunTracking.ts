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

  const [distance, setDistance] = useState(0);

  // NEW: elapsed running time in seconds
  const [elapsedTime, setElapsedTime] = useState(0);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  // NEW: stores the exact time when the run starts
  const startTimeRef = useRef<number | null>(null);

  // Calculate distance between two GPS points
  const calculateDistance = (
    point1: LocationPoint,
    point2: LocationPoint
  ) => {
    const earthRadius = 6371000;

    const latitude1 = (point1.latitude * Math.PI) / 180;
    const latitude2 = (point2.latitude * Math.PI) / 180;

    const latitudeDifference =
      ((point2.latitude - point1.latitude) * Math.PI) / 180;

    const longitudeDifference =
      ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  const startTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      // Reset previous run data
      setLocationPoints([]);
      setCurrentLocation(null);
      setDistance(0);
      setElapsedTime(0);

      // Store exact start timestamp
      startTimeRef.current = Date.now();

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

            setLocationPoints((previousPoints) => {
              if (previousPoints.length === 0) {
                return [point];
              }

              const previousPoint =
                previousPoints[previousPoints.length - 1];

              const segmentDistance =
                calculateDistance(
                  previousPoint,
                  point
                );

              setDistance(
                (previousDistance) =>
                  previousDistance + segmentDistance
              );

              return [...previousPoints, point];
            });
          }
        );
    } catch (error) {
      console.error(
        "Unable to start tracking:",
        error
      );

      setIsTracking(false);
      startTimeRef.current = null;
    }
  };

  const stopTracking = () => {
    locationSubscription.current?.remove();

    locationSubscription.current = null;

    setIsTracking(false);
  };

  // TIMER
  useEffect(() => {
    if (!isTracking) {
      return;
    }

    const timer = setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      const elapsedMilliseconds =
        Date.now() - startTimeRef.current;

      const elapsedSeconds =
        Math.floor(elapsedMilliseconds / 1000);

      setElapsedTime(elapsedSeconds);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isTracking]);

  // Cleanup GPS when screen/hook is destroyed
  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  return {
    isTracking,
    locationPoints,
    currentLocation,
    distance,
    elapsedTime,
    startTracking,
    stopTracking,
  };
}