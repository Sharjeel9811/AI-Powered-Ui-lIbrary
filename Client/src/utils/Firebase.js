import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

let Authentication = null;
let provider = null;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API,
    authDomain: "virtaul-ui.firebaseapp.com",
    projectId: "virtaul-ui",
    storageBucket: "virtaul-ui.firebasestorage.app",
    messagingSenderId: "379227663394",
    appId: "1:379227663394:web:4cb7302b20d465e31c6e7b",
    measurementId: "G-6YH3WLMG9H"
  };

  const app = initializeApp(firebaseConfig);
  Authentication = getAuth(app);
  provider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
}

export { Authentication, provider };

