import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from './config'


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de auth
export const auth = getAuth(app);