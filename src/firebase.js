import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from './config';

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y storage
export const auth = getAuth(app);
export const storage = getStorage(app);