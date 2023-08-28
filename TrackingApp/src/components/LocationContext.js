import React, { useState, useEffect } from "react";

const LocationContext = React.createContext();

const LocationProvider = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [country, setCountry] = useState();
  const [previousCountry, setPreviousCountry] = useState("");
  const [city, setCity] = useState();
  const [totalDays, setTotalDays] = useState();
  const [inCanadaDays, setInCanadaDays] = useState();
  const [outsideCanadaDays, setOutsideCanadaDays] = useState();
  const [trackLocationCounter, setTrackLocationCounter] = useState(0);

  useEffect(() => {
    setTotalDays(0);
    setInCanadaDays(0);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        firstName,
        setFirstName,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        country,
        setCountry,
        previousCountry,
        setPreviousCountry,
        city,
        setCity,
        totalDays,
        setTotalDays,
        inCanadaDays,
        setInCanadaDays,
        outsideCanadaDays,
        setOutsideCanadaDays,
        trackLocationCounter,
        setTrackLocationCounter,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
