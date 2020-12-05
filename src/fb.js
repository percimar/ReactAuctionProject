import firebase from 'firebase/app'
import "firebase/auth"
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyBjjxFWiPvV-u1iCQzzlXxGO1_I9isByhM",
    authDomain: "cp3330-ed06b.firebaseapp.com",
    databaseURL: "https://cp3330-ed06b.firebaseio.com",
    projectId: "cp3330-ed06b",
    storageBucket: "cp3330-ed06b.appspot.com",
    messagingSenderId: "781543877165",
    appId: "1:781543877165:web:6ae8454c5e57a9063e26a4",
    measurementId: "G-00ZXZPLEV2"
  };

firebase.initializeApp(firebaseConfig)

export default firebase