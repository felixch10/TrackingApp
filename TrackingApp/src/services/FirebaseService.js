// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhZaRW7SAHuG7WaAVHWBag0xz1l2T7fC0",
  authDomain: "tracking-app-94ef7.firebaseapp.com",
  projectId: "tracking-app-94ef7",
  storageBucket: "tracking-app-94ef7.appspot.com",
  messagingSenderId: "216201846192",
  appId: "1:216201846192:web:c36be0dba1db3b26a10a75",
  measurementId: "G-RXX3STFMNQ",
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
