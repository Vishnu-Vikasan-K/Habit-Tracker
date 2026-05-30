const API_BASE = 'http://localhost:3000';

export const fetchHabits = async () => {
  try {
    const response = await fetch(`${API_BASE}/habits`);
    return await response.json();
  } catch (error) {
    console.error('Failed to load habits', error);
    return [];
  }
};

export const createHabit = async (payload) => {
  try {
    const response = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to create habit', error);
    return null;
  }
};

export const toggleHabitCompletion = async (habitId) => {
  try {
    const response = await fetch(`${API_BASE}/habits/${habitId}/toggle`, {
      method: 'POST',
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to update habit', error);
    return null;
  }
};
