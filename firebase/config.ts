// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCkijigLfqIltl7o1O106LwMlfFNC0FV-A",

  authDomain: "calender-web-app.firebaseapp.com",

  projectId: "calender-web-app",

  storageBucket: "calender-web-app.appspot.com",

  messagingSenderId: "970247802989",

  appId: "1:970247802989:web:c42c6c5a94290c5977af64",

  measurementId: "G-S3JRTBRLK2"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;