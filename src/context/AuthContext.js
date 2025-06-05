import React, { createContext, useContext, useState, useEffect } from "react";
import { ensureUserDocument, createUserDocument } from "../firebase/userUtils";
import { auth } from "../firebase/config";
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword 
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuthenticated(true);
            setUser(user);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDocument(userCredential.user.uid, userCredential.user.email);
        return true;
        } catch (error) {
        console.error(error);
        return false;
        }
    };

    // NUEVA FUNCIÓN DE REGISTRO
    const register = async (email, password, nombre, nacionalidad) => {
        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Crear documento completo del usuario
        await createUserDocument(userCredential.user.uid, {
            nombre,
            email,
            nacionalidad
        });
        
        return true;
        } catch (error) {
        console.error("Error en registro:", error);
        return false;
        }
    };

    const logout = async () => {
        try {
        await signOut(auth);
        return true;
        } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return false;
        }
    };

    const value = {
        isAuthenticated,
        user,
        login,
        register, // AGREGAR AQUÍ
        logout
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro del AuthProvider');
    }
    return context;
};


