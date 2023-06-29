import { Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const LocationTracking = () => {
  const [location, setLocation] = useState();
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
  }, []);

  const reverseGeocode = () => {};
};

export default LocationTracking;
