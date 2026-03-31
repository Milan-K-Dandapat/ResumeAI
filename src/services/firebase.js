import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgqMhIuGQV71aoVih3RVmSlDU4uXcRaYg",
  authDomain: "resumepro-7fa7b.firebaseapp.com",
  projectId: "resumepro-7fa7b",
  storageBucket: "resumepro-7fa7b.firebasestorage.app",
  messagingSenderId: "183132076",
  appId: "1:183132076:web:bbece3d622f4b38b14a409"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
