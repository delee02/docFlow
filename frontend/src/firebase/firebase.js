// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAixXwZU1G1ioD-HThGBFmTStWZcccfge8",
  authDomain: "docflow-3d011.firebaseapp.com",
  projectId: "docflow-3d011",
  storageBucket: "docflow-3d011.firebasestorage.app",
  messagingSenderId: "77601116753",
  appId: "1:77601116753:web:cf2a7df76fb77f0d251e70",
  measurementId: "G-2GM5EQJNDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const auth = getAuth(app);