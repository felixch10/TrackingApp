import React, { useState } from "react";

const LocationContext = React.createContext();

const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [country, setCountry] = useState();
  const [totalDays, setTotalDays] = useState();
  const [inCanadaDays, setInCanadaDays] = useState();
  return (
    <LocationContext.Provider
      value={{
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        country,
        setCountry,
        totalDays,
        setTotalDays,
        inCanadaDays,
        setInCanadaDays,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
