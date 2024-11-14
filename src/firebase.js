import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Exporta la instancia de auth
export const auth = getAuth(app);