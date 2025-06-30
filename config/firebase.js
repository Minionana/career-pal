import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "replace with actual key",
    authDomain: "career-boro.firebaseapp.com",
    projectId: "career-boro",
    storageBucket: "career-boro.firebasestorage.app",
    messagingSenderId: "334749536387",
    appId: "1:334749536387:web:68924f3940ae09f76c0bb6",
    measurementId: "G-BKD8STJF05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize google provider sign in service
const googleProvider = new GoogleAuthProvider(app);

export { app, auth, googleProvider }