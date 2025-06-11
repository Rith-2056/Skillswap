// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmyzM-SI1s6NLKPXSieFAYo8SD6t-33Bk",
  authDomain: "skillswap-1d43a.firebaseapp.com",
  projectId: "skillswap-1d43a",
  storageBucket: "skillswap-1d43a.appspot.com",
  messagingSenderId: "201180265172",
  appId: "1:201180265172:web:73b179a8ba7f841ab6d941",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
