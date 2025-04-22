import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqaENVRWif43lWYLRRVmmMeDtUEZlPtLE",
  authDomain: "ai-trip-planner-16426.firebaseapp.com",
  projectId: "ai-trip-planner-16426",
  storageBucket: "ai-trip-planner-16426.appspot.com",
  messagingSenderId: "1029399143955",
  appId: "1:1029399143955:web:25ca3322d0e91083c081e6",
  measurementId: "G-GBRXKSXCKR",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
