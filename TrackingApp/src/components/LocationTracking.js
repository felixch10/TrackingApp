import { Alert } from "react-native";
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
  } = useContext(LocationContext);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        //console.log("Please grant location permissions");
        //alert(message.alert);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      console.log(latitude);
      console.log(longitude);
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
        console.log(country);
      }
    };

    reverseGeocode();
  }, [latitude, longitude]);
  return null;
};

export default LocationTracking;
