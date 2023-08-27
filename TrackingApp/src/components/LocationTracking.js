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
    setCountry,
    setCity,
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
        const city = reverseGeocodedAddress[0].city;
        setCountry(country);
        setCity(city);
      }
    };

    reverseGeocode();
  }, [latitude, longitude]);
  return null;
};

export default LocationTracking;
