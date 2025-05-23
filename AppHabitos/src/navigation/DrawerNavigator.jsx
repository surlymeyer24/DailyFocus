import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import TabNavigator from './TabNavigator'

const Drawer = createDrawerNavigator()

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions= {{
                headerStyle: {backgroundColor: "red"},
                headerTintColor: "white",
                drawerStyle: {backgroundColor: "green"},
                drawerActiveTintColor: "white",
                drawerInactiveTintColor: "black",
            }}
        >
            <Drawer.Screen name="Inicio" component={TabNavigator}/>
        </Drawer.Navigator>
    )
}

export default DrawerNavigator