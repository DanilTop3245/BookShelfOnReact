import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfSBcu3HJUiZtwsqORODPOinXYZ0v4tLs",
  authDomain: "registration-66643.firebaseapp.com",
  projectId: "registration-66643",
  storageBucket: "registration-66643.appspot.com",
  messagingSenderId: "936305873313",
  appId: "1:936305873313:web:b5ed76568510342c147be0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
