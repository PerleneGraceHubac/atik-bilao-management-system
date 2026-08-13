# ABMS — Atik Bilao Management System

Internal mobile app for our family's food bilao business. It replaces the handwritten order notebook with a simple order, kitchen, calendar, and sales system.

Phase 1 has **no login**. Use it only on trusted family phones.

## What you can do

- See today's, tomorrow's, this week's, and pending orders on the home screen
- Create, edit, delete, and search orders
- Filter orders: Today, Tomorrow, This Week, Pending, Completed, Cancelled
- Calendar with order counts per day
- Kitchen summary grouped by dish and bilao size
- Customer history
- Menu management (dishes, sizes, prices)
- Simple sales reports (no charts)

## Tech

React Native (Expo + TypeScript), Expo Router, NativeWind, Zustand, React Hook Form + Zod, date-fns, TanStack Query, and Supabase PostgreSQL.

## Setup

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Go to **SQL Editor**, paste the contents of `supabase/migrations/001_initial_schema.sql`, and run it.
3. In **Project Settings → API**, copy the project URL and the `anon` public key.

### 3. Add environment variables

Copy `.env.example` to `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart Expo after saving `.env`.

### 4. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go on Android or iOS.

If Supabase is not configured, the app shows a setup screen instead of the dashboard.

## Using the app

1. Open **More → Menu** if you want to change dishes, sizes, or prices. Sample Filipino bilao dishes and sizes are seeded for you.
2. Tap **New order** to add a customer order. Totals calculate automatically.
3. Use **Kitchen** to see how many trays of each dish/size to cook for a chosen date.
4. Mark orders **Completed** so they count in Reports.

Customers are saved automatically from the contact number when you save an order.

## Project layout

```
app/                 Expo Router screens
src/domain/          Entities and repository contracts
src/data/            Supabase client, mappers, repository implementations
src/hooks/           React Query hooks
src/components/      Reusable UI
src/schemas/         Zod form schemas
src/stores/          Zustand UI state (filters)
supabase/migrations  PostgreSQL schema
```

New features (recipes, inventory, expenses, login) should add tables + repositories under `src/domain` and `src/data` without rewriting existing screens.

## Security note

Row Level Security is on, with open policies for the `anon` key. That is acceptable only for a private family deployment. Do not publish this build to the public app stores until authentication and tighter policies are added.

## Future phases

The folder structure is ready for:

- Recipe and ingredient calculations
- Inventory and shopping lists
- Notifications
- Expense tracking
- Charts and richer analytics
- Supabase Auth login
