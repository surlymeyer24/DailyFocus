import {Redirect, Stack } from 'expo-router';
import {useAuth} from '../../src/context/AuthContext'


export default function AuthLayout() {
    const {isAuthenticated } = useAuth();
    if(isAuthenticated){
        return <Redirect href={"/(main)/(tabs)"}/>
    }
    return (
        <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='login' options={{headerShown: false}}/>      
        <Stack.Screen name='register' options={{ headerShown: false }} /> 
        </Stack>
    )
}