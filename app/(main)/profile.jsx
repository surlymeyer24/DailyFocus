import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/config';
import { StyleSheet } from 'react-native';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar información del usuario desde Firestore
    useEffect(() => {
        const loadUserInfo = async () => {
        if (user) {
            try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                setUserInfo(userSnap.data());
            } else {
                console.log("No se encontró información del usuario");
            }
            } catch (error) {
            console.error("Error al cargar info del usuario:", error);
            } finally {
            setLoading(false);
            }
        }
        };

        loadUserInfo();
    }, [user]);

    const handleLogout = async () => {
        try {
        const success = await logout();
        if (success) {
            router.replace('/(auth)/login');
        } else {
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
        } catch (error) {
        Alert.alert('Error', 'Algo salió mal');
        }
    };

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={{ marginTop: 10 }}>Cargando perfil...</Text>
        </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#f1e3d3' }}>
        
        <Text style={styles.title}>
            Mi Perfil
        </Text>

        {/* Información del usuario */}
        <View style={styles.container2}>
            
            <Text style={styles.text1}>
            Información Personal
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 10, color: '#444' }}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Nombre:</Text> {userInfo?.nombre || 'No disponible'}
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 10, color: '#444' }}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Email:</Text> {userInfo?.email || user?.email}
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 10, color: '#444' }}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Nacionalidad:</Text> {userInfo?.nacionalidad || 'No disponible'}
            </Text>

        </View>

        {/* Información técnica */}
        <View style={{ 
            backgroundColor: '#a09086', 
            padding: 15, 
            borderRadius: 10, 
            marginBottom: 30 
        }}>
            <Text style={{ fontSize: 14, color: '#444' }}>
            ID de usuario: {user?.uid?.slice(0, 12)}...
            </Text>
            {userInfo?.createdAt && (
            <Text style={{ fontSize: 14, color: '#888', marginTop: 5 }}>
                Miembro desde: {new Date(userInfo.createdAt).toLocaleDateString()}
            </Text>
            )}
        </View>

        <TouchableOpacity 
            onPress={handleLogout}
            style={styles.button}
        >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Cerrar Sesión
            </Text>
        </TouchableOpacity>

        </View>
    );    
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b98b73',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
    },
    container2: {
        flex: 1,
        backgroundColor: '#a09086',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
    },
    title: {
        color: '#333',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40
    },
    form: {
        gap:20,

    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    }, button: {
        backgroundColor: '#56443f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    hint: {
        color: '#ccc',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14
    },
    text1: {
        fontSize: 24,
        color: '#333',
        marginBottom: 10
    },
    text2: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5
    },
    text3: {
        fontSize: 14,
        color: '#888',
        marginTop: 5
    }
    })

export default ProfileScreen;