import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAAzykzKArn_nqtQbROjMxJ1aRN_ZOS6B4",
    authDomain: "mule-eyelash-45c26.firebaseapp.com",
    projectId: "mule-eyelash-45c26",
    storageBucket: "mule-eyelash-45c26.firebasestorage.app",
    messagingSenderId: "767066119476",
    appId: "1:767066119476:web:5f4503f762b82d7bdf5961",
    measurementId: "G-H1B7SJCTPT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
