import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDcNR1yJmtx9SnT3VPNsQL4IPG6th7O3iE",
    authDomain: "mule-eyelash.firebaseapp.com",
    projectId: "mule-eyelash",
    storageBucket: "mule-eyelash.firebasestorage.app",
    messagingSenderId: "841390413072",
    appId: "1:841390413072:web:0dc9c8a9e9702b54d94195",
    measurementId: "G-YJMGKJ1GKD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
