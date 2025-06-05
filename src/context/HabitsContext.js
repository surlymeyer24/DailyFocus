import { addDoc, collection, doc, getDocs, Timestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const HabitsContext = createContext();

export const useHabits = () => { 
    const context = useContext(HabitsContext);
    if (!context) {
        throw new Error('useHabits debe ser usado dentro de un HabitsProvider');
    }
    return context;
}

export const HabitsProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Función para obtener el día actual en español
    const getCurrentDay = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        return days[today.getDay()];
    };

    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Función para cargar hábitos
    const fetchHabits = async () => {
        if (!user) {
            setHabits([]);
            return;
        }
        
        setLoading(true);
        try {
            const userRef = collection(db, "users", user.uid, "habits");
            const querySnapshot = await getDocs(userRef);
            
            const habitsArray = [];
            querySnapshot.forEach((doc) => {
                habitsArray.push({ id: doc.id, ...doc.data() });
            });
            
            setHabits(habitsArray);
            console.log("Hábitos cargados:", habitsArray);
        } catch (error) {
            console.error("Error cargando hábitos:", error);
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar hábitos cuando el usuario cambie
    useEffect(() => {
        if (user) {
            fetchHabits();
        } else {
            setHabits([]);
        }
    }, [user]);

    // Función para agregar un nuevo hábito
    const addHabit = async (habitData) => {
        if (!user) return false;
        
        try {
            const userRef = collection(db, "users", user.uid, "habits");
            const docRef = await addDoc(userRef, {
                name: habitData.name,
                days: habitData.days,
                color: habitData.color,
                emoji: habitData.emoji,
                createdAt: Timestamp.now(),
                completedDates: [] // Array de fechas en formato 'YYYY-MM-DD'
            });
            
            // Actualizar el estado local
            const newHabit = {
                id: docRef.id,
                name: habitData.name,
                days: habitData.days,
                color: habitData.color,
                emoji: habitData.emoji,
                createdAt: Timestamp.now(),
                completedDates: []
            };
            
            setHabits(prevHabits => [...prevHabits, newHabit]);
            return true;
        } catch (error) {
            console.error("Error agregando hábito:", error);
            return false;
        }
    };

    // Función para actualizar un hábito
    const updateHabit = async (habitId, habitData) => {
        if (!user) return false;
        
        try {
            const habitRef = doc(db, "users", user.uid, "habits", habitId);
            await updateDoc(habitRef, {
                name: habitData.name,
                days: habitData.days,
                color: habitData.color,
                emoji: habitData.emoji,
                updatedAt: Timestamp.now()
            });
            
            // Actualizar el estado local
            setHabits(prevHabits => 
                prevHabits.map(habit => 
                    habit.id === habitId 
                        ? { ...habit, ...habitData, updatedAt: Timestamp.now() }
                        : habit
                )
            );
            return true;
        } catch (error) {
            console.error("Error actualizando hábito:", error);
            return false;
        }
    };

    // Función para eliminar un hábito
    const deleteHabit = async (habitId) => {
        if (!user) return false;
        
        try {
            const habitRef = doc(db, "users", user.uid, "habits", habitId);
            await deleteDoc(habitRef);
            
            // Actualizar el estado local
            setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
            return true;
        } catch (error) {
            console.error("Error eliminando hábito:", error);
            return false;
        }
    };

    // FUNCIÓN ACTUALIZADA: Marcar/desmarcar hábito como completado para una fecha específica
    const toggleHabitCompletion = async (habitId, dateString = null) => {
        if (!user) return false;
        
        const targetDate = dateString || getTodayString();
        const habit = habits.find(h => h.id === habitId);
        
        if (!habit) return false;
        
        try {
            const habitRef = doc(db, "users", user.uid, "habits", habitId);
            const currentCompletedDates = habit.completedDates || [];
            
            let updatedCompletedDates;
            if (currentCompletedDates.includes(targetDate)) {
                // Remover la fecha
                updatedCompletedDates = currentCompletedDates.filter(date => date !== targetDate);
            } else {
                // Agregar la fecha
                updatedCompletedDates = [...currentCompletedDates, targetDate];
            }
            
            await updateDoc(habitRef, {
                completedDates: updatedCompletedDates
            });
            
            // Actualizar el estado local
            setHabits(prevHabits => 
                prevHabits.map(h => 
                    h.id === habitId 
                        ? { ...h, completedDates: updatedCompletedDates }
                        : h
                )
            );
            return true;
        } catch (error) {
            console.error("Error toggling habit completion:", error);
            return false;
        }
    };

    // FUNCIÓN NUEVA: Obtener estado de completitud para una fecha específica
    const getCompletionStatus = (habitId, dateString = null) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return false;
        
        const targetDate = dateString || getTodayString();
        return (habit.completedDates || []).includes(targetDate);
    };

    // Función para verificar si un hábito está completado hoy (mantener para compatibilidad)
    const isHabitCompletedToday = (habitId) => {
        return getCompletionStatus(habitId);
    };

    // Función para filtrar hábitos por día actual
    const getTodayHabits = () => {
        const currentDay = getCurrentDay();
        return habits.filter(habit => 
            habit.days && habit.days.includes(currentDay)
        );
    };

    // Función para obtener hábitos de un día específico
    const getHabitsForDay = (day) => {
        return habits.filter(habit => 
            habit.days && habit.days.includes(day)
        );
    };

    // FUNCIÓN NUEVA: Obtener hábitos para una fecha específica
    const getHabitsForDate = (date) => {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        return habits.filter(habit => 
            habit.days && habit.days.includes(dayName)
        );
    };

    // FUNCIÓN NUEVA: Obtener estadísticas de un hábito
    const getHabitStats = (habitId) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return null;

        const completedDates = habit.completedDates || [];
        const totalDays = completedDates.length;
        
        // Calcular racha actual
        let currentStreak = 0;
        const today = new Date();
        const sortedDates = completedDates
            .map(dateString => new Date(dateString))
            .sort((a, b) => b - a); // Ordenar de más reciente a más antigua

        if (sortedDates.length > 0) {
            let currentDate = new Date(today);
            currentDate.setHours(0, 0, 0, 0);
            
            for (const completedDate of sortedDates) {
                completedDate.setHours(0, 0, 0, 0);
                const diffTime = currentDate - completedDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === currentStreak) {
                    currentStreak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        // Calcular racha más larga
        let longestStreak = 0;
        let tempStreak = 0;
        const allDates = completedDates
            .map(dateString => new Date(dateString))
            .sort((a, b) => a - b);

        for (let i = 0; i < allDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = allDates[i - 1];
                const currentDate = allDates[i];
                const diffTime = currentDate - prevDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return {
            totalCompletions: totalDays,
            currentStreak,
            longestStreak,
            completedDates: completedDates
        };
    };

    // FUNCIÓN NUEVA: Obtener porcentaje de completitud de un hábito en un período
    const getHabitCompletionRate = (habitId, days = 30) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        let totalExpectedDays = 0;
        let completedDays = 0;

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dayName = dayNames[d.getDay()];
            if (habit.days && habit.days.includes(dayName)) {
                totalExpectedDays++;
                const dateString = d.toISOString().split('T')[0];
                if ((habit.completedDates || []).includes(dateString)) {
                    completedDays++;
                }
            }
        }

        return totalExpectedDays > 0 ? (completedDays / totalExpectedDays) * 100 : 0;
    };

    return (
        <HabitsContext.Provider value={{ 
            habits, 
            loading,
            fetchHabits,
            addHabit,
            updateHabit,
            deleteHabit,
            toggleHabitCompletion,
            getCompletionStatus, // NUEVA
            isHabitCompletedToday,
            getTodayHabits,
            getHabitsForDay,
            getHabitsForDate, // NUEVA
            getCurrentDay,
            getHabitStats, // NUEVA
            getHabitCompletionRate, // NUEVA
        }}>
            {children}
        </HabitsContext.Provider>
    );
}
