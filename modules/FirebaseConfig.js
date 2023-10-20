// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNHbIZ9-AJO4mFN0Z0rP3uX231yGxhkbc",
  authDomain: "godareauth.firebaseapp.com",
  projectId: "godareauth",
  storageBucket: "godareauth.appspot.com",
  messagingSenderId: "641559104166",
  appId: "1:641559104166:web:e274907c47855cdc1bc267"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);