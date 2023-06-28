import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../services/FirebaseService";

const HomeScreen = () => {
  const [name, setName] = useState("");

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

  const changePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        resetEmailAlertHandler();
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          //todo
          alert(alert.message);
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome Back, {name.firstName}</Text>
      <View style={styles.buttonContainer}>
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
  text: {
    fontSize: 16,
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
