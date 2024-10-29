import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAIw0Qc75fTr7C0xYwMqlgafbxABEYImb0",
  authDomain: "bitacora-peces.firebaseapp.com",
  projectId: "bitacora-peces",
  storageBucket: "bitacora-peces.appspot.com",
  messagingSenderId: "479926767904",
  appId: "1:479926767904:web:9b1b062bec0d1280e6c745",
  measurementId: "G-B5BQHY5NPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de auth
export const auth = getAuth(app);