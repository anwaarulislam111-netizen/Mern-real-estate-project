// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-5fbc4.firebaseapp.com",
  projectId: "real-state-5fbc4",
  storageBucket: "real-state-5fbc4.firebasestorage.app",
  messagingSenderId: "58283544235",
  appId: "1:58283544235:web:91d7707b301fa9761931ee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);