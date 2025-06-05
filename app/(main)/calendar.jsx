import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../../src/context/HabitsContext';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { habits, toggleHabitCompletion, getHabitsForDate, getCompletionStatus } = useHabits();

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSameMonth = (date) => {
        return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
    };

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const getDayName = (date) => {
        const days = ['domingo', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };

    const getHabitsForSelectedDate = () => {
        const dayName = getDayName(selectedDate);
        return habits.filter(habit => habit.days && habit.days.includes(dayName));
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

    const getDateCompletionCount = (date) => {
        const dayName = getDayName(date);
        const dateHabits = habits.filter(habit => habit.days && habit.days.includes(dayName));
        const dateString = formatDate(date);
        const completedCount = dateHabits.filter(habit => 
            getCompletionStatus(habit.id, dateString)
        ).length;
        
        return { completed: completedCount, total: dateHabits.length };
    };

    const renderCalendarDay = (date) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isCurrentMonth = isSameMonth(date);
        const isTodayDate = isToday(date);
        const completion = getDateCompletionCount(date);
        const hasHabits = completion.total > 0;
        const allCompleted = hasHabits && completion.completed === completion.total;

        return (
            <TouchableOpacity
                key={date.toISOString()}
                style={[
                    styles.calendarDay,
                    isSelected && styles.selectedDay,
                    isTodayDate && styles.todayDay,
                    !isCurrentMonth && styles.otherMonthDay
                ]}
                onPress={() => setSelectedDate(date)}
            >
                <Text style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isTodayDate && styles.todayDayText,
                    !isCurrentMonth && styles.otherMonthDayText
                ]}>
                    {date.getDate()}
                </Text>
                {hasHabits && (
                    <View style={[
                        styles.completionIndicator,
                        allCompleted ? styles.allCompletedIndicator : styles.partialCompletedIndicator
                    ]}>
                        <Text style={styles.completionText}>
                            {completion.completed}/{completion.total}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const selectedDateHabits = getHabitsForSelectedDate();

    return (
        <ScrollView style={styles.container}>
            {/* Header del calendario */}
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => navigateMonth(-1)}>
                    <Ionicons name="chevron-back" size={24} color="#56443f" />
                </TouchableOpacity>
                
                <Text style={styles.monthTitle}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Text>
                
                <TouchableOpacity onPress={() => navigateMonth(1)}>
                    <Ionicons name="chevron-forward" size={24} color="#56443f" />
                </TouchableOpacity>
            </View>

            {/* Días de la semana */}
            <View style={styles.weekDays}>
                {dayNames.map((day) => (
                    <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {/* Grid del calendario */}
            <View style={styles.calendarGrid}>
                {getDaysInMonth(currentMonth).map(renderCalendarDay)}
            </View>

            {/* Hábitos del día seleccionado */}
            <View style={styles.habitsSection}>
                <Text style={styles.habitsSectionTitle}>
                    Hábitos para {selectedDate.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </Text>

                {selectedDateHabits.length === 0 ? (
                    <View style={styles.noHabitsContainer}>
                        <Text style={styles.noHabitsText}>
                            No tienes hábitos programados para este día
                        </Text>
                    </View>
                ) : (
                    selectedDateHabits.map((habit) => {
                        const completed = isHabitCompleted(habit.id);
                        return (
                            <TouchableOpacity
                                key={habit.id}
                                style={[
                                    styles.habitItem,
                                    { borderLeftColor: habit.color || '#56443f' },
                                    completed && styles.completedHabitItem
                                ]}
                                onPress={() => handleHabitToggle(habit.id)}
                            >
                                <View style={styles.habitContent}>
                                    <View style={styles.habitInfo}>
                                        <Text style={styles.habitEmoji}>{habit.emoji || '⭐'}</Text>
                                        <View style={styles.habitDetails}>
                                            <Text style={[
                                                styles.habitName,
                                                completed && styles.completedHabitName
                                            ]}>
                                                {habit.name}
                                            </Text>
                                            <Text style={styles.habitStatus}>
                                                {completed ? 'Completado' : 'Pendiente'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[
                                        styles.checkBox,
                                        completed && styles.checkedBox
                                    ]}>
                                        {completed && (
                                            <Ionicons name="checkmark" size={20} color="#fff" />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
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
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#56443f',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    weekDayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#56443f',
        textAlign: 'center',
        flex: 1,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 5,
        marginBottom: 20,
    },
    calendarDay: {
        width: '14.28%',
        // aspectRatio: 1,
        justifyContent: 'center',
        height: 40,
        alignItems: 'center',
        borderRadius: 50,
        margin: 0,
        position: 'relative',
    },
    selectedDay: {
        backgroundColor: '#b7a7a9',
        borderRadius: 50,
    },
    todayDay: {
        backgroundColor: '#d8cec5',
    },
    otherMonthDay: {
        opacity: 0.3,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    todayDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    otherMonthDayText: {
        color: '#999',
    },
    completionIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        minWidth: 16,
        height: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    allCompletedIndicator: {
        backgroundColor: '#00B894',
    },
    partialCompletedIndicator: {
        backgroundColor: '#FDCB6E',
    },
    completionText: {
        fontSize: 8,
        color: '#fff',
        fontWeight: 'bold',
    },
    habitsSection: {
        marginTop: 10,
    },
    habitsSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#56443f',
        marginBottom: 15,
        textTransform: 'capitalize',
    },
    noHabitsContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
    },
    noHabitsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    habitItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
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
        marginRight: 12,
    },
    habitDetails: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    completedHabitName: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    habitStatus: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    checkBox: {
        width: 30,
        height: 30,
        borderRadius: 15,
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
});

export default CalendarScreen;