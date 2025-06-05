import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const ensureUserDocument = async (uid, email) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            email,
            habits: [],
            createdAt: new Date().toISOString()
            });
    }
    };


// NUEVA FUNCIÓN para crear usuario completo al registrarse
export const createUserDocument = async (uid, userData) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString()
    });
};