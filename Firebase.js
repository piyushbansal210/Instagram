// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv3jK1Lk3ELYVA0F-WTb5IHl0eLCH-c3M",
  authDomain: "instagram-7c983.firebaseapp.com",
  projectId: "instagram-7c983",
  storageBucket: "instagram-7c983.appspot.com",
  messagingSenderId: "700655068050",
  appId: "1:700655068050:web:8af364297d62ff1890974b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
