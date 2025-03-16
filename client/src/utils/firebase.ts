import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_IQgJkmgXBM1RCSLnwDXHLZwbEAUs8LE",
  authDomain: "headout-ccb34.firebaseapp.com",
  projectId: "headout-ccb34",
  storageBucket: "headout-ccb34.firebasestorage.app",
  messagingSenderId: "1793773403",
  appId: "1:1793773403:web:5a6ca95e9972aea8df947e",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
