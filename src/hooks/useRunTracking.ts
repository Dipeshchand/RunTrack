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
  const [isPaused, setIsPaused] = useState(false);

  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<LocationPoint | null>(null);

  const [distance, setDistance] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [pace, setPace] = useState<number | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  const startTimeRef = useRef<number | null>(null);

  // Stores the elapsed running time when the run is paused.
  const pausedElapsedTimeRef = useRef(0);

  /*
   * Calculate pace.
   *
   * Pace = elapsed time / distance
   *
   * Example:
   * 1800 seconds / 5 km = 360 seconds/km = 6:00/km
   */
  useEffect(() => {
    if (distance <= 0 || elapsedTime <= 0) {
      setPace(null);
      return;
    }

    const distanceInKilometers = distance / 1000;

    const paceSecondsPerKm =
      elapsedTime / distanceInKilometers;

    setPace(paceSecondsPerKm);
  }, [distance, elapsedTime]);

  /*
   * Haversine formula.
   *
   * Calculates the distance between two GPS coordinates
   * on the surface of the Earth.
   */
  const calculateDistance = (
    point1: LocationPoint,
    point2: LocationPoint
  ) => {
    const earthRadius = 6371000;

    const latitude1 =
      (point1.latitude * Math.PI) / 180;

    const latitude2 =
      (point2.latitude * Math.PI) / 180;

    const latitudeDifference =
      ((point2.latitude - point1.latitude) *
        Math.PI) /
      180;

    const longitudeDifference =
      ((point2.longitude - point1.longitude) *
        Math.PI) /
      180;

    const a =
      Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  /*
   * Start a completely new run.
   */
  const startTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      // Reset previous run data.
      setLocationPoints([]);
      setCurrentLocation(null);
      setDistance(0);
      setElapsedTime(0);
      setPace(null);

      // Reset pause information.
      pausedElapsedTimeRef.current = 0;

      // Start the timer.
      startTimeRef.current = Date.now();

      setIsPaused(false);
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
              // First GPS point.
              if (previousPoints.length === 0) {
                return [point];
              }

              // Previous GPS point.
              const previousPoint =
                previousPoints[
                  previousPoints.length - 1
                ];

              // Calculate distance between
              // previous point and current point.
              const segmentDistance =
                calculateDistance(
                  previousPoint,
                  point
                );

              // Add the new segment distance
              // to the total distance.
              setDistance(
                (previousDistance) =>
                  previousDistance +
                  segmentDistance
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
      setIsPaused(false);
      startTimeRef.current = null;
    }
  };

  /*
   * Pause the current run.
   */
  const pauseTracking = () => {
    // Stop receiving GPS updates.
    locationSubscription.current?.remove();
    locationSubscription.current = null;

    // Remember how much running time has passed.
    pausedElapsedTimeRef.current = elapsedTime;

    setIsTracking(false);
    setIsPaused(true);
  };

  /*
   * Resume the paused run.
   */
  const resumeTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      /*
       * Adjust the start time so that the timer
       * continues from the previous elapsed time.
       *
       * Example:
       *
       * Previous elapsed time = 60 seconds
       *
       * Current time = 12:10:00
       *
       * New start time = 12:09:00
       *
       * Therefore:
       *
       * 12:10:01 - 12:09:00 = 61 seconds
       */
      startTimeRef.current =
        Date.now() -
        pausedElapsedTimeRef.current * 1000;

      setIsPaused(false);
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
                previousPoints[
                  previousPoints.length - 1
                ];

              const segmentDistance =
                calculateDistance(
                  previousPoint,
                  point
                );

              setDistance(
                (previousDistance) =>
                  previousDistance +
                  segmentDistance
              );

              return [...previousPoints, point];
            });
          }
        );
    } catch (error) {
      console.error(
        "Unable to resume tracking:",
        error
      );

      setIsTracking(false);
    }
  };

  /*
   * Completely stop the run.
   */
  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;

    setIsTracking(false);
    setIsPaused(false);
  };

  /*
   * Timer.
   *
   * Runs only while isTracking === true.
   *
   * When paused:
   * isTracking = false
   * → interval is cleared.
   *
   * When resumed:
   * isTracking = true
   * → interval starts again.
   */
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
        Math.floor(
          elapsedMilliseconds / 1000
        );

      setElapsedTime(elapsedSeconds);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isTracking]);

  /*
   * Cleanup GPS subscription when
   * the component is destroyed.
   */
  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  return {
    isTracking,
    isPaused,

    locationPoints,
    currentLocation,

    distance,
    elapsedTime,
    pace,

    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
}