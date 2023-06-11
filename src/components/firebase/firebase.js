// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqUtxpKmKOqGk17pfS_wX1U_H90W548BY",
    authDomain: "movie-app-bacb8.firebaseapp.com",
    projectId: "movie-app-bacb8",
    storageBucket: "movie-app-bacb8.appspot.com",
    messagingSenderId: "182641712629",
    appId: "1:182641712629:web:8ffb47add6195699ed14bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const moviesref = collection(db, "movies");
export const reviewsref = collection(db, "reviews");
export const usersref = collection(db, "users");


export default app;