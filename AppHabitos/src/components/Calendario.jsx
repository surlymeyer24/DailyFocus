import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

const Calendario = () => {
    const today = new Date()
    const mesActual = today.getMonth() + 1
    const anioActual = today.getFullYear()

    const nombreMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    const letrasDias = ["L", "M", "M", "J", "V", "S", "D"]

    const diasEnMes = new Date(anioActual, mesActual, 0).getDate()
    let primerDia = new Date(anioActual, mesActual - 1, 1).getDay()

    const dias = Array.from({ length: diasEnMes }, (_, i) => {
        const fecha = new Date(anioActual, mesActual, i + 1)
        return {
            dia: i + 1,
            letra: letrasDias[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1],
            }
        })

    return ( 
        <View style={styles.container}>
            <Text style={styles.titulo}>{nombreMeses[mesActual]}</Text>
            <FlatList
                horizontal
                data={dias}
                keyExtractor= {(item) => item.dia.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.lista}
                renderItem={({item}) => (
                    <View style={styles.item}> 
                        <Text style={styles.letra}>{item.letra}</Text>
                        <View style={styles.circulo}>
                            <Text style={styles.numero}>{item.dia}</Text>
                        </View>
                    </View>
                )}
            />
    </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "f09ec6",
        paddingVertical: 10, 
        alignItems: "center",
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    lista: {
        paddingHorizontal: 10,
    },
    item: {
        alignItems: "center",
        marginHorizontal: 5,
    },
    letra: {
        marginBottom: 5,
        fontWeight: "bold"
    },

    circulo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#555",
        justifyContent: "center",
        alignItems: "center",
    },
    numero: {
        fontWeight: "bold",
        color: "white"
    }
})
export default Calendario