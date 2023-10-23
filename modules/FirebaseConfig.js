// Import the functions you need from the SDKs you need
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNHbIZ9-AJO4mFN0Z0rP3uX231yGxhkbc",
  authDomain: "godareauth.firebaseapp.com",
  projectId: "godareauth",
  storageBucket: "godareauth.appspot.com",
  messagingSenderId: "641559104166",
  appId: "1:641559104166:web:e274907c47855cdc1bc267",
  databaseURL: ''
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig )
} else {
    app = firebase.app()
}

export const db = firebase.firestore();
export const db_firesotre = getFirestore(app);
export default firebase;