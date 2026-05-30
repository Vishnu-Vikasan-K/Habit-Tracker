import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import habitsRouter from './routes/habits.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/habits', habitsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Habit Tracker API listening on http://localhost:${port}`);
});
