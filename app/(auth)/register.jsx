import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';


const RegisterScreen = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    
    const { register } = useAuth();

    const handleRegister = async () => {
        // Validaciones básicas
        if (!nombre || !email || !password || !nacionalidad) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
        }

        try {
            const success = await register(email, password, nombre, nacionalidad);
        
            if (success) {
                Alert.alert('Éxito', 'Usuario registrado correctamente', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
                ]);
            } else {
                Alert.alert('Error', 'No se pudo registrar el usuario');
            }
        } catch (error) {
            Alert.alert('Error', 'Algo salió mal');
        }
    };

    return (
        <View style={styles.container}>
        
            <Text style={styles.title}>
            Registro
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Nombre:</Text>
            <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre completo"
                style={styles.input}
            />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Email:</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Contraseña:</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                style={
                styles.input
                }
            />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Nacionalidad:</Text>
            <TextInput
                value={nacionalidad}
                onChangeText={setNacionalidad}
                placeholder="Ej: Argentina, México, España..."
                style={styles.input}
            />

            <TouchableOpacity 
                onPress={handleRegister}
                style={styles.button}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Registrarse
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => router.back()}
                style={{ alignItems: 'center' }}
            >
                <Text style={{ color: 'blue' }}>
                ¿Ya tienes cuenta? Inicia sesión
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
        padding: 20
    },
    title: {
        color: '#fff',
        fontSize: 48,
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
        marginBottom: 3,
        fontSize: 16,
    }, button: {
        backgroundColor: '#56443f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
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
    }
    })
export default RegisterScreen;