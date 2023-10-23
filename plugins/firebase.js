import { initializeApp, getApps } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNgdrSkwWKACjKBqYMoJeVjmIdEQBk9Jo",
  authDomain: "emaus-db.firebaseapp.com",
  projectId: "emaus-db",
  storageBucket: "emaus-db.appspot.com",
  messagingSenderId: "784859592636",
  appId: "1:784859592636:web:e412c724240644de4b1db9",
  measurementId: "G-21GJNCVLR7",
};

let firebaseApp;

const apps = getApps();
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const db = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export {
  db,
  auth,
  storage,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
};
