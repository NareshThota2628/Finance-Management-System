import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHfAz4PvCV4ZRvN61BsRmVG-hnHjAJlpo",
    authDomain: "finance-app-cf779.firebaseapp.com",
    projectId: "finance-app-cf779",
    storageBucket: "finance-app-cf779.firebasestorage.app",
    messagingSenderId: "652743992083",
    appId: "1:652743992083:web:35e42b3a5fef062496b0e6",
    measurementId: "G-E8CWB87HHB"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);