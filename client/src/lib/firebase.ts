import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGlr98xucMGoLAKJRbdWSshFQJxRT2E3M",
  authDomain: "logitrack-ba724.firebaseapp.com",
  projectId: "logitrack-ba724",
  storageBucket: "logitrack-ba724.appspot.com",
  messagingSenderId: "604886617263",
  appId: "1:604886617263:web:6b605b6a89340a5af4985a",
  measurementId: "G-7M2SR8P2B3"
};

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  console.log("Firebase configuration validated successfully");
  console.log("Using Firebase project:", firebaseConfig.projectId);
  return true;
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  try {
    // Validate config before initializing
    if (!validateFirebaseConfig()) {
      throw new Error("Invalid Firebase configuration");
    }
    
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } else {
      app = getApps()[0];
      console.log("Using existing Firebase app");
    }
    
    auth = getAuth(app);
    console.log("Firebase Auth initialized");
    
    db = getFirestore(app);
    console.log("Firestore initialized");
    
    // Initialize analytics only if supported
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized");
      } else {
        console.log("Firebase Analytics not supported in this environment");
      }
    }).catch(err => {
      console.error("Error checking Analytics support:", err);
    });
    
    console.log("All Firebase services initialized");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { auth, db, analytics };

