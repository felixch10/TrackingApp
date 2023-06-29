import { Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const LocationTracking = () => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongtitude] = useState();
  const [country, setCountry] = useState();

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
      setLongtitude(longitude);
      console.log(latitude);
      console.log(longitude);
    };
    getPermissions();
    reverseGeocode();
  }, []);

  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: longitude,
      latitude: latitude,
    });
    if (reverseGeocodedAddress && reverseGeocodedAddress.length > 0) {
      const country = reverseGeocodedAddress[0].country;
      setCountry(country);
      console.log(country);
    }
  };
};

export default LocationTracking;
