
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseApp = initializeApp({
  apiKey: "AIzaSyA_gqDq1ZASrcKbWZ6AB5ZxnBTP8jJb2rQ",
  authDomain: "cinesphereauth.firebaseapp.com",
  databaseURL: "https://cinesphereauth-default-rtdb.firebaseio.com",
  projectId: "cinesphereauth",
  storageBucket: "cinesphereauth.appspot.com",
  messagingSenderId: "15029371201",
  appId: "1:15029371201:web:36676c0fce516a1a76e1c0"
});


export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);


