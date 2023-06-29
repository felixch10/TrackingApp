import { Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const LocationTracking = () => {
  const [location, setLocation] = useState();
  const [latitude, setLatitude] = useState();
  const [longtitude, setLongtitude] = useState();

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        //console.log("Please grant location permissions");
        alert(message.alert)
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Latitude:", currentLocation.coords.latitude);
      console.log("Longtitude:", currentLocation.coords.longitude);
    };
    getPermissions();
  }, []);

  const reverseGeocode = 
};

export default LocationTracking;
