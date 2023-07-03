import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { firebase } from "../services/FirebaseService";
import LocationTracking from "../components/LocationTracking";
import {
  LocationProvider,
  LocationContext,
} from "../components/LocationContext";

const HomeScreen = () => {
  const {
    firstName,
    setFirstName,
    latitude,
    longitude,
    country,
    totalDays,
    setTotalDays,
    inCanadaDays,
    setInCanadaDays,
  } = useContext(LocationContext);

  const [trackLocationCounter, setTrackLocationCounter] = useState(0);

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
        } else {
          //alert(alert.message);
        }
      });
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

  return (
    <SafeAreaView style={styles.container} key={trackLocationCounter}>
      <LocationTracking />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back, {firstName}</Text>
      </View>
      <Text>{country}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => updateLocation()}
        >
          <Text style={styles.buttonText}>Track Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button2}
          onPress={() => changePassword()}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => firebase.auth().signOut()}
        >
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
