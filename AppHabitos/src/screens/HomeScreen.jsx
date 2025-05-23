import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Calendario from '../components/Calendario'


// Este es el componente de la pantalla de inicio
const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Calendario/>
            <View>
                <Text>Habito</Text>
                <Text>Dias del habito</Text>
                <Text>Progreso</Text>
            </View>
            <View>
                <Text>Agregar habito</Text>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#888',
    },
    bloque: {
        margin: 20,
        padding: 10,
        borderColor: '#000',
        borderWidth: 3,
        borderRadius: 10,
    },
    boton: {
        margin: 20,
        padding: 10,
        borderColor: '#000',
        borderWidth: 3,
        borderRadius: 10,
        alignItems: 'center',
    },
    texto: {
        fontWeight: 'bold',
        marginVertical: 5,
    },
})

export default HomeScreen