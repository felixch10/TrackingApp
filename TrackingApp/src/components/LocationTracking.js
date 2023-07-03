import { Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { LocationProvider, LocationContext } from "./LocationContext";

const LocationTracking = () => {
  const {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    country,
    setCountry,
    trackLocationCounter,
    setTrackLocationCounter,
  } = useContext(LocationContext);

  const locationAlertHandler = () => {
    Alert.alert(
      "Location Error",
      "Please set Allow Location Access to always",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        locationAlertHandler();
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    };

    getPermissions();
  }, []);

  useEffect(() => {
    const reverseGeocode = async () => {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      if (reverseGeocodedAddress && reverseGeocodedAddress.length > 0) {
        const country = reverseGeocodedAddress[0].country;
        setCountry(country);
      }
    };

    reverseGeocode();
  }, [latitude, longitude]);
  return null;
};

export default LocationTracking;

/*import { Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { LocationProvider, LocationContext } from "./LocationContext";

const LocationTracking = () => {
  const {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    country,
    setCountry,
    trackLocationCounter,
    setTrackLocationCounter,
  } = useContext(LocationContext);

  const locationAlertHandler = () => {
    Alert.alert(
      "Location Error",
      "Please set Allow Location Access to always",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };

  const updateLocation = () => {
    const userRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid);
    const currentDate = new Date().toISOString().split("T")[0];
    const userLocation = {
      latitude: latitude,
      longitude: longitude,
      country: country,
    };

    let updatedInCanadaDays = inCanadaDays;
    let updatedTotalDays = totalDays + 1;

    if (country === "Canada") {
      updatedInCanadaDays += 1;
    }

    setTotalDays(updatedTotalDays);
    setInCanadaDays(updatedInCanadaDays);

    const updateData = {
      [currentDate]: userLocation,
      inCanadaDays: updatedInCanadaDays,
      totalDays: updatedTotalDays,
    };

    userRef
      .update(updateData)
      .then(() => {
        console.debug("Location updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating location:", error);
      });

    setTrackLocationCounter(trackLocationCounter + 1);
  };

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        locationAlertHandler();
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      updateLocation();
    };

    getPermissions();
  }, []);

  useEffect(() => {
    const backgroundLocationTask = async () => {
      await Location.startLocationUpdatesAsync("background", {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 24 * 60 * 60 * 1000,
        foregroundService: {
          notificationTitle: "Location Tracking",
          notificationBody: "Tracking your location in the background",
        },
      });

      Location.addLocationListener((location) => {
        const { latitude, longitude } = location.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        updateLocation();
      });
    };
    backgroundLocationTask();
  }, []);

  useEffect(() => {
    const reverseGeocode = async () => {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      if (reverseGeocodedAddress && reverseGeocodedAddress.length > 0) {
        const country = reverseGeocodedAddress[0].country;
        setCountry(country);
      }
    };

    reverseGeocode();
  }, [latitude, longitude]);

  return null;
};

export default LocationTracking;*/
