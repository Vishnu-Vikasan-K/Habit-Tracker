# Habit-Tracker

A simple habit tracker built with React Native for the mobile experience and a Node.js + PostgreSQL backend for habit storage and daily completion tracking.

## Project structure

- `mobile/` — Expo-based React Native app
- `server/` — Express API with PostgreSQL persistence

## Getting started

### 1. Backend

1. Create a PostgreSQL database named `habit_tracker` (or update `DATABASE_URL` in `server/.env.example`).
2. Copy `server/.env.example` to `server/.env` and set your database credentials.
3. Run migrations:
   ```bash
   psql "$DATABASE_URL" -f server/migrations/init.sql
   ```
4. Install dependencies and start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```

### 2. Mobile app

1. Install dependencies and run the Expo app:
   ```bash
   cd mobile
   npm install
   npm start
   ```
2. Use Expo Go or an emulator to open the mobile app.

## Features

- Track daily habits
- Add custom habits with descriptions
- Mark habits complete for the current day
- View completion streaks and progress

## Notes

- The mobile app is configured to call the backend at `http://localhost:3000`.
- If you run on a physical device, update `mobile/src/services/api.js` to your machine's local IP address.
