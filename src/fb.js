import firebase from 'firebase/app'
import "firebase/auth"
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBmsJgU3_CVrfdDuti1DaYQqat0wFMRw0U",
    authDomain: "cp3330-project-141af.firebaseapp.com",
    databaseURL: "https://cp3330-project-141af.firebaseio.com",
    projectId: "cp3330-project-141af",
    storageBucket: "cp3330-project-141af.appspot.com",
    messagingSenderId: "421978077842",
    appId: "1:421978077842:web:6c8a53a31c2c3f7b9b844b",
    measurementId: "G-NC3Y5FZHFW"
};

firebase.initializeApp(firebaseConfig)

export default firebase