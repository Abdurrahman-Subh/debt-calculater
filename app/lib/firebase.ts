import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB8cSexBAL3aiR8um8M5nLcWePvhYq764Y",

  authDomain: "debt-calculater.firebaseapp.com",

  projectId: "debt-calculater",

  storageBucket: "debt-calculater.firebasestorage.app",

  messagingSenderId: "962469701168",

  appId: "1:962469701168:web:bd275f881bc3f6263eaff5",

  measurementId: "G-6JPSJS60GB",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics only in browser environments
let analytics = null;
if (typeof window !== "undefined") {
  // We're in the browser
  (async () => {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  })();
}

export { app, db, auth, analytics };
