// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8_3i-a-e-LFeMq97itsINwZr5Qi9OdQ8",
  authDomain: "drone-25d69.firebaseapp.com",
  databaseURL: "https://drone-25d69-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "drone-25d69",
  storageBucket: "drone-25d69.appspot.com",
  messagingSenderId: "450263563076",
  appId: "1:450263563076:web:ae5f3e0cc477c39b547511",
  measurementId: "G-7Y9LXFD7CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const analytics = getAnalytics(app);