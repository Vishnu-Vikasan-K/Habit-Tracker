import express from 'express';
import { query } from '../db.js';

const router = express.Router();

function buildStreak(logs) {
  const dateStrings = logs
    .filter((log) => log.completed)
    .map((log) => log.date.toISOString().slice(0, 10));
  const today = new Date();
  let streak = 0;
  let current = new Date(today);

  while (true) {
    const dateKey = current.toISOString().slice(0, 10);
    if (!dateStrings.includes(dateKey)) break;
    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

router.get('/', async (req, res) => {
  try {
    const habitsResult = await query('SELECT * FROM habits ORDER BY created_at DESC');
    const habitIds = habitsResult.rows.map((habit) => habit.id);
    let logsResult = { rows: [] };

    if (habitIds.length) {
      logsResult = await query(
        "SELECT habit_id, date, completed FROM habit_logs WHERE habit_id = ANY($1) AND date >= CURRENT_DATE - INTERVAL '30 days' ORDER BY habit_id, date DESC",
        [habitIds],
      );
    }

    const logsByHabit = logsResult.rows.reduce((acc, log) => {
      acc[log.habit_id] = acc[log.habit_id] || [];
      acc[log.habit_id].push(log);
      return acc;
    }, {});

    const response = habitsResult.rows.map((habit) => {
      const logs = logsByHabit[habit.id] || [];
      const completedToday = logs.some((log) => log.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) && log.completed);
      return {
        ...habit,
        completedToday,
        current_streak: buildStreak(logs),
      };
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Habit title is required' });
  }

  try {
    const result = await query(
      'INSERT INTO habits (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || null],
    );
    res.status(201).json({ ...result.rows[0], completedToday: false, current_streak: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

router.post('/:id/toggle', async (req, res) => {
  const habitId = Number(req.params.id);
  if (!habitId) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  try {
    const dateResult = await query('SELECT * FROM habit_logs WHERE habit_id = $1 AND date = CURRENT_DATE', [habitId]);
    let completed = true;

    if (dateResult.rows.length) {
      completed = !dateResult.rows[0].completed;
      await query('UPDATE habit_logs SET completed = $1 WHERE id = $2', [completed, dateResult.rows[0].id]);
    } else {
      await query('INSERT INTO habit_logs (habit_id, date, completed) VALUES ($1, CURRENT_DATE, TRUE)', [habitId]);
    }

    const habitResult = await query('SELECT * FROM habits WHERE id = $1', [habitId]);
    const logsResult = await query(
      "SELECT date, completed FROM habit_logs WHERE habit_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days' ORDER BY date DESC",
      [habitId],
    );
    const logs = logsResult.rows;
    const completedToday = logs.some((log) => log.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) && log.completed);

    res.json({
      ...habitResult.rows[0],
      completedToday,
      current_streak: buildStreak(logs),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle habit completion' });
  }
});

export default router;
