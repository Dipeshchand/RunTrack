import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export type LocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export function useRunTracking() {
  const [isTracking, setIsTracking] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [locationPoints, setLocationPoints] =
    useState<LocationPoint[]>([]);

  const [currentLocation, setCurrentLocation] =
    useState<LocationPoint | null>(null);

  const [distance, setDistance] =
    useState(0);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [pace, setPace] =
    useState<number | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(
      null
    );

  const startTimeRef =
    useRef<number | null>(null);

  const pausedElapsedTimeRef =
    useRef(0);

  // --------------------------------
  // CALCULATE DISTANCE
  // --------------------------------

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
      ((point2.latitude -
        point1.latitude) *
        Math.PI) /
      180;

    const longitudeDifference =
      ((point2.longitude -
        point1.longitude) *
        Math.PI) /
      180;

    const a =
      Math.sin(
        latitudeDifference / 2
      ) **
        2 +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(
          longitudeDifference / 2
        ) **
          2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  // --------------------------------
  // UPDATE PACE
  // --------------------------------

  useEffect(() => {
    if (
      distance <= 0 ||
      elapsedTime <= 0
    ) {
      setPace(null);
      return;
    }

    const distanceInKilometers =
      distance / 1000;

    const paceSecondsPerKm =
      elapsedTime /
      distanceInKilometers;

    setPace(paceSecondsPerKm);
  }, [distance, elapsedTime]);

  // --------------------------------
  // LOCATION CALLBACK
  // --------------------------------

  const handleLocationUpdate = (
    location: Location.LocationObject
  ) => {
    const point: LocationPoint = {
      latitude:
        location.coords.latitude,

      longitude:
        location.coords.longitude,

      accuracy:
        location.coords.accuracy,

      timestamp:
        location.timestamp,
    };

    setCurrentLocation(point);

    setLocationPoints(
      (previousPoints) => {
        if (
          previousPoints.length === 0
        ) {
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

        return [
          ...previousPoints,
          point,
        ];
      }
    );
  };

  // --------------------------------
  // START TRACKING
  // --------------------------------

  const startTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error(
          "Location permission denied"
        );
      }

      // Reset run data

      setLocationPoints([]);

      setCurrentLocation(null);

      setDistance(0);

      setElapsedTime(0);

      setPace(null);

      pausedElapsedTimeRef.current = 0;

      startTimeRef.current =
        Date.now();

      setIsPaused(false);

      setIsTracking(true);

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 2000,

            distanceInterval: 5,
          },
          handleLocationUpdate
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

  // --------------------------------
  // PAUSE
  // --------------------------------

  const pauseTracking = () => {
    locationSubscription.current?.remove();

    locationSubscription.current =
      null;

    pausedElapsedTimeRef.current =
      elapsedTime;

    setIsTracking(false);

    setIsPaused(true);
  };

  // --------------------------------
  // RESUME
  // --------------------------------

  const resumeTracking = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error(
          "Location permission denied"
        );
      }

      startTimeRef.current =
        Date.now() -
        pausedElapsedTimeRef.current *
          1000;

      setIsPaused(false);

      setIsTracking(true);

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 2000,

            distanceInterval: 5,
          },
          handleLocationUpdate
        );
    } catch (error) {
      console.error(
        "Unable to resume tracking:",
        error
      );

      setIsTracking(false);
    }
  };

  // --------------------------------
  // STOP
  // --------------------------------

  const stopTracking = () => {
    // Remove GPS watcher

    locationSubscription.current?.remove();

    locationSubscription.current =
      null;

    // Stop tracking state

    setIsTracking(false);

    setIsPaused(false);

    // Stop timer

    startTimeRef.current = null;
  };

  // --------------------------------
  // TIMER
  // --------------------------------

  useEffect(() => {
    if (!isTracking) {
      return;
    }

    const timer = setInterval(() => {
      if (
        startTimeRef.current === null
      ) {
        return;
      }

      const elapsedMilliseconds =
        Date.now() -
        startTimeRef.current;

      const elapsedSeconds =
        Math.floor(
          elapsedMilliseconds / 1000
        );

      setElapsedTime(
        elapsedSeconds
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isTracking]);

  // --------------------------------
  // CLEANUP
  // --------------------------------

  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  // --------------------------------
  // RETURN
  // --------------------------------

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