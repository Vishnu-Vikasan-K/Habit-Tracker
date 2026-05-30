import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HabitCard from './src/components/HabitCard';
import { createHabit, fetchHabits, toggleHabitCompletion } from './src/services/api';
import theme from './src/theme';

export default function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    setLoading(true);
    const data = await fetchHabits();
    if (data) setHabits(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleAddHabit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please provide a habit title.');
      return;
    }

    const habit = await createHabit({ title, description });
    if (habit) {
      setTitle('');
      setDescription('');
      setHabits([habit, ...habits]);
    }
  };

  const handleToggle = async (habitId) => {
    const updatedHabit = await toggleHabitCompletion(habitId);
    if (updatedHabit) {
      setHabits(habits.map((item) => (item.id === habitId ? updatedHabit : item)));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      <Text style={styles.subtitle}>Build daily routines and stay consistent.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Create a habit</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Habit name"
          placeholderTextColor={theme.colors.muted}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          placeholderTextColor={theme.colors.muted}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
          <Text style={styles.buttonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your habits</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {loading ? (
          <Text style={styles.loading}>Loading habits...</Text>
        ) : habits.length === 0 ? (
          <Text style={styles.empty}>No habits yet. Add one to get started.</Text>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onToggle={() => handleToggle(habit.id)} />
          ))
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: theme.colors.text,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 40,
  },
  loading: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  empty: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
