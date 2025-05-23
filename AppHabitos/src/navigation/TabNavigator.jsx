import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import StackNavigator from './StackNavigator'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {backgroundColor: "blue" },
                tabBarActiveTintColor: "gray",
                tabBarInactiveTintColor: "black"
            }}
        >
            <Tab.Screen
                name="Inicio" component={StackNavigator}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator