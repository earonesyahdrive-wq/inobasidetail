// =========================
// FIREBASE CONFIG
// =========================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkDGpfV6UuS3MDZFd6RcNfvbZ9546jpR8",
  authDomain: "inovasi-266b8.firebaseapp.com",
  databaseURL: "https://inovasi-266b8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inovasi-266b8",
  storageBucket: "inovasi-266b8.firebasestorage.app",
  messagingSenderId: "237367721357",
  appId: "1:237367721357:web:dce7791842fbb5ce9e11c4",
  measurementId: "G-E265JQSVF2"
};
// =========================
// INIT FIREBASE
// =========================
firebase.initializeApp(firebaseConfig);

// =========================
// SERVICE EXPORT
// =========================
const db = firebase.database();
const storage = firebase.storage();