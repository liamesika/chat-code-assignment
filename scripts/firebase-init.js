// scripts/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyA20gVGMT4SgU5dzW9zPnchH8449M3CxHA",
  authDomain: "mytrademind.com",
  projectId: "trade-mind-9fe52",
  storageBucket: "trade-mind-9fe52.appspot.com",
  messagingSenderId: "912036654055",
  appId: "1:912036654055:web:afe612d3f0a42d74cdeb42",
  measurementId: "G-WMTCKK0S3S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ firebase-init loaded");
