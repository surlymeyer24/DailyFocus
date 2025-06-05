import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { useHabits } from "../../../src/context/HabitsContext";

const AddHabitScreen = () => {
    const [habit, setHabit] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#56443f');
    const [selectedEmoji, setSelectedEmoji] = useState('⭐');
    const [saving, setSaving] = useState(false);
    const { addHabit, updateHabit, habits } = useHabits();
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Verificar si estamos editando
    const isEditing = params.editId ? true : false;
    const editingHabit = isEditing ? habits.find(h => h.id === params.editId) : null;

    const daysOfWeek = [
        { id: 'monday', name: 'Lun', fullName: 'Lunes' },
        { id: 'tuesday', name: 'Mar', fullName: 'Martes' },
        { id: 'wednesday', name: 'Mié', fullName: 'Miércoles' },
        { id: 'thursday', name: 'Jue', fullName: 'Jueves' },
        { id: 'friday', name: 'Vie', fullName: 'Viernes' },
        { id: 'saturday', name: 'Sáb', fullName: 'Sábado' },
        { id: 'sunday', name: 'Dom', fullName: 'Domingo' }
    ];

    const colors = [
        '#fad35e', '#ffb88a', '#ff9c5b', '#fbc2c2', 
        '#cb7876', '#b4cfa4', '#62866c', '#81b2d9',
        '#32769b', '#bba6dd', '#64557b', '#1e2136', '#9a9ea1', '#444'
    ];

    const emojis = [
        '⭐', '🎯', '💪', '📚', '🏃‍♂️', '🧘‍♀️', 
        '💧', '🥗', '🎵', '✍️', '🌱', '❤️',
        '🔥', '⚡', '🌟', '🎨', '🎮', '☕'
    ];

    // Cargar datos si estamos editando
    useEffect(() => {
        if (isEditing && editingHabit) {
            setHabit(editingHabit.name);
            setSelectedDays(editingHabit.days || []);
            setSelectedColor(editingHabit.color || '#56443f');
            setSelectedEmoji(editingHabit.emoji || '⭐');
        }
    }, [isEditing, editingHabit]);

    const toggleDay = (dayId) => {
        setSelectedDays(prev => 
            prev.includes(dayId) 
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    const handleSave = async () => {
        if (!habit.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el hábito');
            return;
        }

        if (selectedDays.length === 0) {
            Alert.alert('Error', 'Por favor selecciona al menos un día de la semana');
            return;
        }

        setSaving(true);
        
        try {
            const habitData = {
                name: habit.trim(),
                days: selectedDays,
                color: selectedColor,
                emoji: selectedEmoji
            };

            let success;
            if (isEditing) {
                success = await updateHabit(params.editId, habitData);
            } else {
                success = await addHabit(habitData);
            }
            
            if (success) {
                Alert.alert(
                    'Éxito', 
                    isEditing ? 'Hábito actualizado correctamente' : 'Hábito creado correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                if (!isEditing) {
                                    // Solo limpiar formulario si no estamos editando
                                    setHabit('');
                                    setSelectedDays([]);
                                    setSelectedColor('#56443f');
                                    setSelectedEmoji('⭐');
                                }
                                router.push('/');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', isEditing ? 'No se pudo actualizar el hábito' : 'No se pudo crear el hábito');
            }
        } catch (error) {
            console.error("Error guardando hábito:", error);
            Alert.alert("Error", "Ocurrió un error inesperado");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
                {isEditing ? 'Editar Hábito' : 'Nuevo Hábito'}
            </Text>
            
            {/* Nombre del hábito */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nombre del hábito</Text>
                <TextInput
                    placeholder="Ej.: Leer 30 minutos"
                    value={habit}
                    onChangeText={setHabit}
                    style={styles.input}
                    placeholderTextColor="#999"
                    editable={!saving}
                />
            </View>

            {/* Días de la semana */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Días de la semana</Text>
                <View style={styles.daysContainer}>
                    {daysOfWeek.map((day) => (
                        <TouchableOpacity
                            key={day.id}
                            onPress={() => toggleDay(day.id)}
                            style={[
                                styles.dayButton,
                                selectedDays.includes(day.id) && styles.dayButtonSelected
                            ]}
                            disabled={saving}
                        >
                            <Text style={[
                                styles.dayButtonText,
                                selectedDays.includes(day.id) && styles.dayButtonTextSelected
                            ]}>
                                {day.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Colores */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Color del hábito</Text>
                <View style={styles.colorsContainer}>
                    {colors.map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            style={[
                                styles.colorButton,
                                { backgroundColor: color },
                                selectedColor === color && styles.colorButtonSelected
                            ]}
                            disabled={saving}
                        />
                    ))}
                </View>
            </View>

            {/* Emojis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emoji representativo</Text>
                <View style={styles.emojisContainer}>
                    {emojis.map((emoji) => (
                        <TouchableOpacity
                            key={emoji}
                            onPress={() => setSelectedEmoji(emoji)}
                            style={[
                                styles.emojiButton,
                                selectedEmoji === emoji && styles.emojiButtonSelected
                            ]}
                            disabled={saving}
                        >
                            <Text style={styles.emojiText}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
                <Text style={styles.sectionTitle}>Vista previa</Text>
                <View style={[styles.previewCard, { borderLeftColor: selectedColor }]}>
                    <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
                    <Text style={styles.previewName}>
                        {habit || 'Nombre del hábito'}
                    </Text>
                    <Text style={styles.previewDays}>
                        {selectedDays.length > 0 
                            ? `${selectedDays.length} días por semana`
                            : 'Selecciona los días'
                        }
                    </Text>
                </View>
            </View>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[
                        styles.saveButton, 
                        { backgroundColor: selectedColor },
                        saving && styles.buttonDisabled
                    ]}
                    disabled={saving}
                >
                    <Text style={styles.saveButtonText}>
                        {saving 
                            ? (isEditing ? 'Actualizando...' : 'Creando...') 
                            : (isEditing ? 'Actualizar Hábito' : 'Crear Hábito')
                        }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={styles.cancelButton}
                    disabled={saving}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1e3d3',
        padding: 20,
    },
    title: {
        color: '#56443f',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 10
    },
    section: {
        marginBottom: 25
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#56443f',
        marginBottom: 10
    },
    input: {
        backgroundColor: '#fff',
        color: '#333',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    dayButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ddd'
    },
    dayButtonSelected: {
        backgroundColor: '#56443f',
        borderColor: '#56443f'
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666'
    },
    dayButtonTextSelected: {
        color: '#fff'
    },
    colorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'transparent'
    },
    colorButtonSelected: {
        borderColor: '#333',
        transform: [{ scale: 1.1 }]
    },
    emojisContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    emojiButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd'
    },
    emojiButtonSelected: {
        borderColor: '#56443f',
        backgroundColor: '#f8f8f8'
    },
    emojiText: {
        fontSize: 24
    },
    previewSection: {
        marginBottom: 30
    },
    previewCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    previewEmoji: {
        fontSize: 32,
        marginBottom: 8
    },
    previewName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4
    },
    previewDays: {
        fontSize: 14,
        color: '#666'
    },
    buttonsContainer: {
        gap: 12,
        marginBottom: 30
    },
    saveButton: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    cancelButton: {
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#56443f'
    },
    cancelButtonText: {
        color: '#56443f',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonDisabled: {
        opacity: 0.6
    }
});

export default AddHabitScreen;