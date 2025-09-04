// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAan8Li9qkkU629uSbud53fAoAjKWglF8s",
  authDomain: "docflow-2c674.firebaseapp.com",
  projectId: "docflow-2c674",
  storageBucket: "docflow-2c674.firebasestorage.app",
  messagingSenderId: "666587614235",
  appId: "1:666587614235:web:a24c67619ec4c9695f7cbe",
  measurementId: "G-7GSKM0N71R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);