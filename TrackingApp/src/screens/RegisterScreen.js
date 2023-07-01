import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { firebase } from "../services/FirebaseService";
import {
  LocationProvider,
  LocationContext,
} from "../components/LocationContext";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { totalDays, inCanadaDays } = useContext(LocationContext);

  const verificationAlertHandler = () => {
    Alert.alert(
      "Verify Email",
      "Verification email sent, please check the spam folder",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };

  const errorAlertHandler = () => {
    Alert.alert(
      "Sign Up Error",
      "Please make sure all credentials are filled.",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };
  const existingEmailHandler = () => {
    Alert.alert(
      "Sign Up Error",
      "Email already exists.",
      [
        {
          text: "Dismiss",
        },
      ],
      { cancelable: false }
    );
  };

  registerUser = async (email, password, firstName, lastName) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: "https://tracking-app-94ef7.firebaseapp.com",
          })
          .then(() => {
            verificationAlertHandler();
          })
          .catch((error) => {
            errorAlertHandler();
          })
          .then(() => {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                firstName,
                lastName,
                email,
                totalDays,
                inCanadaDays,
              });
          })
          .catch((error) => {
            errorAlertHandler();
          });
      })
      .catch((error) => {
        existingEmailHandler();
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="First Name"
            onChangeText={(firstName) => setFirstName(firstName)}
            style={styles.input}
            autoCorrect={false}
          />
          <TextInput
            placeholder="Last Name"
            onChangeText={(lastName) => setLastName(lastName)}
            style={styles.input}
            autoCorrect={false}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => registerUser(email, password, firstName, lastName)}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

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
  inputContainer: {
    width: "80%",
    marginTop: 40,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 30,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "dodgerblue",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "dodgerblue",
    borderWidth: 3,
  },
  buttonOutlineText: { color: "dodgerblue", fontWeight: "700", fontSize: 16 },
});
