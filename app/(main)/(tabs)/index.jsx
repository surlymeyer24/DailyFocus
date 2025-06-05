import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from "../../../src/context/HabitsContext";

const HomeScreen = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { habits, fetchHabits, loading, toggleHabitCompletion, getCompletionStatus, deleteHabit } = useHabits();

    const getDayName = (date) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getTodayHabits = () => {
        const dayName = getDayName(selectedDate);
        return habits.filter(habit => habit.days && habit.days.includes(dayName));
    };

    const navigateDay = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + direction);
        setSelectedDate(newDate);
    };

    const isToday = () => {
        const today = new Date();
        return selectedDate.toDateString() === today.toDateString();
    };

    const handleRefresh = () => {
        fetchHabits();
    };

    const handleHabitToggle = async (habitId) => {
        const dateString = formatDate(selectedDate);
        const success = await toggleHabitCompletion(habitId, dateString);
        if (!success) {
            Alert.alert('Error', 'No se pudo actualizar el estado del hábito');
        }
    };

    const isHabitCompleted = (habitId) => {
        const dateString = formatDate(selectedDate);
        return getCompletionStatus(habitId, dateString);
    };

    const handleEditHabit = (habitId) => {
        router.push(`/(main)/(tabs)/addHabit?editId=${habitId}`);
    };

    const handleDeleteHabit = (habitId, habitName) => {
        Alert.alert(
            'Eliminar Hábito',
            `¿Estás seguro de que quieres eliminar "${habitName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteHabit(habitId);
                        if (success) {
                            Alert.alert('Éxito', 'Hábito eliminado correctamente');
                        } else {
                            Alert.alert('Error', 'No se pudo eliminar el hábito');
                        }
                    }
                }
            ]
        );
    };

    const todayHabits = getTodayHabits();

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#56443f" />
                <Text style={{ marginTop: 10, fontSize: 16, color: '#56443f' }}>
                    Cargando hábitos...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Focus</Text>
            
            {/* Navegación de días */}
            <View style={styles.dateNavigation}>
                <TouchableOpacity onPress={() => navigateDay(-1)} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={24} color="#56443f" />
                </TouchableOpacity>
                
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                        {selectedDate.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </Text>
                    {isToday() && <Text style={styles.todayIndicator}>HOY</Text>}
                </View>
                
                <TouchableOpacity onPress={() => navigateDay(1)} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={24} color="#56443f" />
                </TouchableOpacity>
            </View>

            {/* Botón para agregar hábito */}
            <TouchableOpacity
                onPress={() => router.push('/(main)/(tabs)/addHabit')}
                style={styles.addButton}
            >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Agregar hábito</Text>
            </TouchableOpacity>

            {/* Lista de hábitos del día */}
            <View style={{ marginTop: 20, flex: 1 }}>
                <Text style={styles.sectionTitle}>
                    Hábitos para {isToday() ? 'hoy' : 'este día'}:
                </Text>
                <FlatList
                    data={todayHabits}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const completed = isHabitCompleted(item.id);
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.habitItem,
                                    { borderLeftColor: item.color || '#56443f' },
                                    completed && styles.completedHabitItem
                                ]}
                                onPress={() => handleHabitToggle(item.id)}
                            >
                                <View style={styles.habitContent}>
                                    <View style={styles.habitInfo}>
                                        <Text style={styles.habitEmoji}>{item.emoji || '⭐'}</Text>
                                        <View style={styles.habitDetails}>
                                            <Text style={[
                                                styles.habitText,
                                                completed && styles.completedHabitText
                                            ]}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.habitStatus}>
                                                {completed ? 'Completado' : 'Pendiente'}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.habitActions}>
                                        <TouchableOpacity
                                            onPress={() => handleEditHabit(item.id)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="pencil" size={20} color="#666" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteHabit(item.id, item.name)}
                                            style={styles.actionButton}
                                        >
                                            <Ionicons name="trash" size={20} color="#FF6B6B" />
                                        </TouchableOpacity>
                                        <View style={[
                                            styles.checkBox,
                                            completed && styles.checkedBox
                                        ]}>
                                            {completed && (
                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {habits.length === 0 
                                    ? 'No tienes hábitos aún. ¡Agrega tu primer hábito!'
                                    : 'No tienes hábitos programados para este día.'
                                }
                            </Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={handleRefresh}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffe8d6',
        padding: 20
    },
    title: {
        color: '#412f26',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
        fontFamily: "cursive"
    },
    dateNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#cfb3a9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    navButton: {
        padding: 5,
    },
    dateContainer: {
        alignItems: 'center',
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#56443f',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    todayIndicator: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#402d21',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#56443f',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#56443f',
        marginBottom: 15
    },
    habitItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
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
    completedHabitItem: {
        opacity: 0.8,
        backgroundColor: '#f8f9fa',
    },
    habitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    habitInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    habitEmoji: {
        fontSize: 24,
        marginRight: 12
    },
    habitDetails: {
        flex: 1,
    },
    habitText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2
    },
    completedHabitText: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    habitStatus: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    habitActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    actionButton: {
        padding: 5,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkedBox: {
        backgroundColor: '#697254',
        borderColor: '#697254',
    },
    emptyContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    }
});

export default HomeScreen;