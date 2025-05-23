import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const HabitCard = ({titulo, days, porcentaje}) => {
    return (
        <View>
            <Text>{titulo}</Text>
            <Text>Dias del habitos: {days.join(",")}</Text>
            <Text>Porcentaje completado: {porcentaje}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        backgroundColor: "#fff",
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5
    }
})

export default HabitCard