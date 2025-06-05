import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b98b73',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        color: '#fff',
        fontSize: 48,
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
        marginBottom: 3,
        fontSize: 16,
    }, button: {
        backgroundColor: '#56443f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
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