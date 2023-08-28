import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext, useTransition } from "react";
import { firebase } from "../services/FirebaseService";
import LocationTracking from "../components/LocationTracking";
import {
  LocationProvider,
  LocationContext,
} from "../components/LocationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const HomeScreen = () => {
  const {
    firstName,
    setFirstName,
    latitude,
    longitude,
    country,
    previousCountry,
    setPreviousCountry,
    city,
    totalDays,
    setTotalDays,
    inCanadaDays,
    setInCanadaDays,
    trackLocationCounter,
    setTrackLocationCounter,
    outsideCanadaDays,
    setOutsideCanadaDays,
  } = useContext(LocationContext);

  const [lastTrackedTimestamp, setLastTrackedTimestamp] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [regionDays, setRegionDays] = useState();
  const [absenceReason, setAbsenceReason] = useState("");

  const resetEmailAlertHandler = () => {
    Alert.alert(
      "Password Reset",
      "An email has been sent to the registered email, please check the spam folder",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setFirstName(snapshot.data().firstName);
          setTotalDays(snapshot.data().totalDays);
          setInCanadaDays(snapshot.data().inCanadaDays);
          setPreviousCountry(snapshot.data().previousCountry);
        } else {
          //alert(alert.message);
        }
      });
  }, []);

  useEffect(() => {
    const getLastTrackedTimestamp = async () => {
      try {
        const timestamp = await AsyncStorage.getItem("lastTrackedTimestamp");
        setLastTrackedTimestamp(timestamp);
      } catch (error) {
        console.error("Error getting last tracked timestamp:", error);
      }
    };

    getLastTrackedTimestamp();
  }, []);

  const changePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        resetEmailAlertHandler();
      })
      .catch((error) => {
        alert(alert.message);
      });
  };

  const html = `
  <html>
<head>
<style>
  table {
    border-collapse: collapse;
    width: 100%;
    border: 1px solid black;
  }
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
  }
</style>
</head>
<body>

<h2>Time spent outside of Canada</h2>

<table>
  <tr>
    <th>From Date</th>
    <th>To Date</th>
    <th>Your Location during Absence</th>
    <th>Reason for Absence</th>
    <th>If Other, Please Add Reason</th>
    <th>Total Number of Days</th>
  </tr>
  <tr>
    <td>2023-08-12</td>
    <td>2023-08-15</td>
    <td>Vancouver, Canada</td>
    <td></td>
    <td></td>
    <td>3</td>
  </tr>
  <tr>
    <td>2023-08-20</td>
    <td>2023-08-28</td>
    <td>Coquitlam, Canada</td>
    <td></td>
    <td></td>
    <td>8</td>
  </tr>
  <tr>
    <td colspan="5" style="text-align: right;"><strong>Total Days Outside Canada:</strong></td>
    <td id="totalDaysCell">0</td>
  </tr>
</table>

<script>
  // Calculate the total number of days and update the content of the totalDaysCell
  const totalDaysCell = document.getElementById("totalDaysCell");
  let totalDays = 0;

  const rows = document.querySelectorAll("table tr:not(:first-child):not(:last-child)");
  rows.forEach(row => {
    const daysCell = row.querySelector("td:last-child");
    totalDays += parseInt(daysCell.textContent);
  });

  totalDaysCell.textContent = totalDays;
</script>

</body>
</html>
  
  `;

  const downloadPDF = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const trackLocation = async () => {
    const currentTimestamp = Date.now();
    if (
      !lastTrackedTimestamp ||
      currentTimestamp - lastTrackedTimestamp >= 1000
    ) {
      // Sufficient time has passed, proceed with tracking
      await updateLocation();
      setLastTrackedTimestamp(currentTimestamp);
      try {
        await AsyncStorage.setItem(
          "lastTrackedTimestamp",
          currentTimestamp.toString()
        );
      } catch (error) {
        console.error("Error saving last tracked timestamp:", error);
      }
    } else {
      // Not enough time has passed, show an alert
      Alert.alert(
        "Track Location",
        "You can only track location once every 24 hours.",
        [
          {
            text: "Dismiss",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.setItem("keepLoggedIn", JSON.stringify(false));
      // Sign out the user
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateLocation = async () => {
    const userRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid);

    const locationCollection = userRef.collection("locationCollection");
    const previousCountryLocation = previousCountry;

    const currentDate = new Date().toISOString().split("T")[0];
    const userLocation = {
      latitude: latitude,
      longitude: longitude,
      country: country,
      city: city,
    };
    const newOustideCanada = {
      startDate: currentDate,
      endDate: currentDate,
      absenceReason: absenceReason,
      regionDays: 0,
    };

    let updatedInCanadaDays = inCanadaDays;
    let updatedTotalDays = totalDays + 1;

    if (country === "Canada") {
      updatedInCanadaDays += 1;
    }

    setTotalDays(updatedTotalDays);
    setInCanadaDays(updatedInCanadaDays);
    setOutsideCanadaDays(updatedTotalDays - updatedInCanadaDays);
    setPreviousCountry(country);

    const updateData = {
      inCanadaDays: updatedInCanadaDays,
      totalDays: updatedTotalDays,
      outsideCanadaDays: updatedTotalDays - updatedInCanadaDays,
      previousCountry: country,
    };

    const locationData = {
      [currentDate]: userLocation,
    };

    //TODO
    const newOutsideCanadaData = {
      [country]: newOustideCanada,
    };

    try {
      await userRef.update(updateData);
      console.debug("Location updated successfully.");
      console.debug(previousCountryLocation);
    } catch (error) {
      console.error("Error updating location:", error);
    }

    try {
      // Check if a document named "location history" exists
      const existingDocSnapshot = await locationCollection
        .doc("location history")
        .get();

      if (existingDocSnapshot.exists) {
        // Update the existing document
        await locationCollection.doc("location history").update(locationData);
        console.debug("Location data updated within existing document.");
      } else {
        // Create a new document named "location history"
        await locationCollection.doc("location history").set(locationData);
        console.debug("New location history document created.");
      }
    } catch (error) {
      console.error(
        "Error updating or creating location history document:",
        error
      );
    }

    if (country === "Canada" && country === previousCountryLocation) {
      try {
        // Check if a documnet named "Outside Canada" exists
        const existingDocSnapshot = await locationCollection
          .doc("Outside Canada")
          .get();
      } catch (error) {
        console.error(
          "Error updating or creating location history document:",
          error
        );
      }
    }

    setTrackLocationCounter(trackLocationCounter + 1);
  };

  return (
    <SafeAreaView style={styles.container} key={trackLocationCounter}>
      <LocationTracking />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back, {firstName}</Text>
      </View>
      <Text>
        Currently in: {city}, {country}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => trackLocation()}
        >
          <Text style={styles.buttonText}>Track Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => changePassword()}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => downloadPDF()}>
          <Text style={styles.buttonText}>Download Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    position: "absolute",
    top: "15%",
    left: 0,
    width: "100%",
    paddingHorizontal: "10%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "red",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  button2: {
    backgroundColor: "dodgerblue",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
