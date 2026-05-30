import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import theme from '../theme';

export default function HabitCard({ habit, onToggle }) {
  const statusLabel = habit.completedToday ? 'Completed today' : 'Mark complete';

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{habit.title}</Text>
        {habit.description ? <Text style={styles.description}>{habit.description}</Text> : null}
        <Text style={styles.meta}>Streak: {habit.current_streak || 0} days</Text>
      </View>

      <TouchableOpacity style={[styles.button, habit.completedToday && styles.buttonCompleted]} onPress={onToggle}>
        <Text style={[styles.buttonText, habit.completedToday && styles.buttonTextCompleted]}>{statusLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  description: {
    marginTop: 8,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  meta: {
    marginTop: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonCompleted: {
    backgroundColor: theme.colors.success,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonTextCompleted: {
    color: '#fff',
  },
});
