// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

 
const firebaseConfig = {
  apiKey: "AIzaSyD0JWv8n8W9gC-mV0ySfcIF3jog_pyp7Eo",
  authDomain: "cdn-image-32525.firebaseapp.com",
  projectId: "cdn-image-32525",
  storageBucket: "cdn-image-32525.appspot.com",
  messagingSenderId: "133771323278",
  appId: "1:133771323278:web:d1ddd9f12cdafc3fcfe6df",
  measurementId: "G-8PQJQZ47EH",
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore and Storage instances
export { db, storage };