import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyD9iDx_KT1QQ-7gyAjXSFBPdXcl5kyf3hI",
    authDomain: "dailyfocusapp.firebaseapp.com",
    projectId: "dailyfocusapp",
    storageBucket: "dailyfocusapp.firebasestorage.app",
    messagingSenderId: "878302033636",
    appId: "1:878302033636:web:19b39fb3d9b10cb4699ef1"

}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }

