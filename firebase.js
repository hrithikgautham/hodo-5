// Import the functions you need from the SDKs you need
import {initializeApp, getApps} from "firebase/app";
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore";
import {getStorage, } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjEfDFdyoYCo7m3taQTPfnS58Dwk2fmpc",
  authDomain: "hodo-b93c9.firebaseapp.com",
  projectId: "hodo-b93c9",
  storageBucket: "hodo-b93c9.appspot.com",
  messagingSenderId: "685761882799",
  appId: "1:685761882799:web:d0303253a8bc2b9325425a"
};

// Initialize Firebase
let app = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app);
console.log("firebase initialised...");