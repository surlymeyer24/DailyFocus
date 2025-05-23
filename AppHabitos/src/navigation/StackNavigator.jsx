import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
const Stack = createNativeStackNavigator()


const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions = {{
            headerShown: false,
            headerTintColor: 'pink',
            headerTitleStyle: {fontWeight: 'bold'},
        }}
        >
            <Stack.Screen
            name="Inicio"
            component={HomeScreen}
            options={{ title: 'Inicio' }}
            />
        </Stack.Navigator>
    )
}

export default StackNavigator