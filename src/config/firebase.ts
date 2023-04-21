// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlY5SSopi6XMTe2ceXIUAfN2SemNI8w6c",
  authDomain: "react-social-media-72c7a.firebaseapp.com",
  projectId: "react-social-media-72c7a",
  storageBucket: "react-social-media-72c7a.appspot.com",
  messagingSenderId: "551125696941",
  appId: "1:551125696941:web:cd5ce0edf067078c3da124"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();