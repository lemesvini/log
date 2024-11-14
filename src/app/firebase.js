// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCnGkmYEQBASfQM8bd2vN9rLdxw0IVm2fA",
    authDomain: "logs-c3132.firebaseapp.com",
    projectId: "logs-c3132",
    storageBucket: "logs-c3132.firebasestorage.app",
    messagingSenderId: "405260170505",
    appId: "1:405260170505:web:107b83817e16f366b58fd8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
