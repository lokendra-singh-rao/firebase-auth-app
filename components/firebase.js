// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCLCHEXOHPUu5_JPQQIZmnDDFM2DfMECQU",
  authDomain: "react-auth-app-1.firebaseapp.com",
  projectId: "react-auth-app-1",
  storageBucket: "react-auth-app-1.appspot.com",
  messagingSenderId: "351437768049",
  appId: "1:351437768049:web:18beef9da930880ec6e2d0"
};
// Deployment script to be run in terminal
// firebase deploy --only hosting:lokendra-firebase-auth-app

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;