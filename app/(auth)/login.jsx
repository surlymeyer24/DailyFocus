import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';


export default function LoginScreen() {

  // creamos estados 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // obtenemos la funcion login del context
    const { login } = useAuth();

    const handleLogin = async () => {
        if(!email.trim() || !password.trim()){
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        } 
        
        try {
            const success = await login(email, password);
            
            if(!success){
                Alert.alert(
                    'Error de Autenticación',
                    'Email o contraseña incorrectos'
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Algo salió mal al iniciar sesión');
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title1}>DailyFocus</Text>
            <Text style={styles.title}> Iniciar Sesion</Text>
            <View>
                <TextInput 
                placeholder='Email'
                placeholderTextColor={'#ccc'}
                autoCapitalize='none'
                keyboardType='email-address'
                value={email}
                style={styles.input}
                onChangeText={setEmail}
                />
                <TextInput 
                placeholder='Contraseña'
                placeholderTextColor={"#ccc"}
                secureTextEntry
                value={password}
                style={styles.input}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}> Entrar </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => router.push('/(auth)/register')}
                style={{ alignItems: 'center', marginTop: 20 }}
            >
                <Text style={{ color: 'brown', fontSize: 16 }}>
                ¿No tienes cuenta? Regístrate aquí
                </Text>
            </TouchableOpacity>
            </View>
            </View>
        )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1e3d3',
        justifyContent: 'center',
        padding: 20
    },
    title1: {
        color: '#7f6269',
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: "cursive"
    },
    title: {
        color: '#56443f',
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
    }
    })
