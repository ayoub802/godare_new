import firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDNHbIZ9-AJO4mFN0Z0rP3uX231yGxhkbc",
    authDomain: "godareauth.firebaseapp.com",
    projectId: "godareauth",
    storageBucket: "godareauth.appspot.com",
    messagingSenderId: "641559104166",
    appId: "1:641559104166:web:e274907c47855cdc1bc267"
  };

if (!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}


export default firebase;