import { useAuth } from '../../src/context/AuthContext';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

export default function MainLayout(){
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated){
        return <Redirect href={"/(auth)/login"}/>
    }

    return (
        <Drawer
        screenOptions={{
            headerStyle: { backgroundColor: "#b98b73" },
            headerTintColor: "#333",
            drawerStyle: { backgroundColor: "#333" },
            drawerActiveTintColor: "#00b5cc",
            drawerInactiveTintColor: "#ccc",
        }}
        >
        <Drawer.Screen 
            name="(tabs)"
            options={{
            drawerLabel: "Habitos",
            title: "Habitos"
            }}
        />
        <Drawer.Screen 
            name="calendar"
            options={{
            drawerLabel: "Calendario",
            title: "Calendario"
            }}  
        />
        <Drawer.Screen 
            name="profile"
            options={{
            drawerLabel: "Mi Perfil",
            title: "Mi Perfil"
            }}  
        />
        </Drawer>
    );
}