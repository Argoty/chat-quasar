import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

// import firebase from "firebase/app";
// import 'firebase/auth'
// import 'firebase/firestore'



// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore()
// const auth = firebase.auth()
// const marcaTiempo = firebase.firestore.FieldValue.serverTimestamp;

// export {db, auth, marcaTiempo}

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "chat-quasar-ed040.firebaseapp.com",
  projectId: "chat-quasar-ed040",
  storageBucket: "chat-quasar-ed040.appspot.com",
  messagingSenderId: "622448569755",
  appId: "1:622448569755:web:72b5b2560634c7aca4053e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app)

export {auth, firestore}

export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
