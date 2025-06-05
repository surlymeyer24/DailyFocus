import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#56443f',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#cdc6c3',
                    borderTopColor: '#ddd',
                },
                tabBarLabelStyle: {
                    fontSize: 8,
                    fontWeight: 'bold',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Hoy',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="today" size={size} color={color} />
                    ),
                }}

            />
            <Tabs.Screen
                name="addHabit"
                options={{
                    title: 'Agregar',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" size={size} color={color} />
                    ),
                }}
                
            />
        </Tabs>
    );
}