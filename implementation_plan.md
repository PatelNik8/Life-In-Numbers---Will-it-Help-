# Life in Numbers – Personal Data Dashboard
## Architecture & Implementation Blueprint

> A Google Analytics for your personal life — track habits, health, and productivity with stunning 3D visuals.

---

## 1. Tech Stack Decision

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/SSG, file-based routing, API routes, great DX |
| Language | **TypeScript** | Type safety across full stack |
| Styling | **Tailwind CSS** + **shadcn/ui** | Rapid, consistent, accessible UI |
| 3D / Animation | **Three.js** + **React Three Fiber** + **Framer Motion** | True 3D scene rendering + smooth 2D animations |
| Charts | **Recharts** + **D3.js** | Responsive charts and custom data-driven visuals |
| State | **Zustand** | Lightweight global state |
| Forms | **React Hook Form** + **Zod** | Validation + schema-driven forms |
| Auth | **NextAuth.js v5** | OAuth (Google, GitHub) + email/password |

### Backend
| Layer | Choice | Why |
|---|---|---|
| API | **Next.js Route Handlers** (REST) | Collocated with frontend, easy deployment |
| ORM | **Prisma** | Type-safe DB queries, migration management |
| Database | **PostgreSQL** (via Supabase) | Relational, battle-tested, free tier |
| Cache | **Redis** (Upstash serverless) | Session cache, streak computation, rate limiting |
| Queue | **BullMQ** (future) | Weekly digest emails, AI batch jobs |

### Infrastructure / DevOps
| Layer | Choice | Why |
|---|---|---|
| Hosting | **Vercel** | Zero-config Next.js deploy, edge functions |
| DB Host | **Supabase** | Managed PostgreSQL + realtime + free tier |
| Redis | **Upstash** | Serverless Redis, Vercel-native |
| Email | **Resend** | Developer-friendly transactional email |
| Storage | **Cloudinary** / S3 | Profile images |
| Monitoring | **Vercel Analytics** + **Sentry** | Performance + error tracking |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│   Next.js 14 App (React + Three.js + Framer Motion)    │
│   ┌──────────────┐  ┌────────────┐  ┌───────────────┐  │
│   │  3D Landing  │  │ Dashboard  │  │  Log Entry    │  │
│   │  Page        │  │ (Charts)   │  │  Forms        │  │
│   └──────────────┘  └────────────┘  └───────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTPS / REST
┌───────────────────────────▼─────────────────────────────┐
│                 NEXT.JS ROUTE HANDLERS                   │
│                  /api/** endpoints                       │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│   │  /auth   │ │ /metrics │ │ /habits  │ │/insights │ │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└──────────┬───────────────────────────┬───────────────────┘
           │                           │
┌──────────▼──────────┐   ┌───────────▼────────────┐
│   PostgreSQL         │   │    Redis (Upstash)      │
│   (Supabase)         │   │  • Streak cache         │
│   • Users            │   │  • Session store        │
│   • Metrics          │   │  • Rate limiting        │
│   • Habits           │   └────────────────────────┘
│   • Insights         │
└─────────────────────┘
```

---

## 3. Folder Structure

```
life-in-numbers/
├── .env.local
├── .env.example
├── next.config.ts
├── prisma/
│   ├── schema.prisma           # DB schema
│   └── migrations/
├── public/
│   ├── fonts/
│   └── assets/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Sidebar + Navbar
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── log/page.tsx    # Log today's metrics
│   │   │   ├── habits/page.tsx # Habit manager
│   │   │   ├── history/page.tsx# Historical charts
│   │   │   ├── insights/page.tsx# AI insights
│   │   │   └── settings/page.tsx
│   │   ├── (landing)/
│   │   │   └── page.tsx        # 3D animated landing
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── metrics/
│   │   │   │   ├── route.ts    # GET list, POST create
│   │   │   │   └── [id]/route.ts # GET, PUT, DELETE
│   │   │   ├── habits/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── insights/route.ts
│   │   │   └── score/route.ts  # Life score calculation
│   │   └── layout.tsx
│   ├── components/
│   │   ├── 3d/                 # Three.js / R3F components
│   │   │   ├── Scene.tsx
│   │   │   ├── FloatingOrbs.tsx
│   │   │   └── GlassCard3D.tsx
│   │   ├── charts/
│   │   │   ├── RadarChart.tsx
│   │   │   ├── TrendLine.tsx
│   │   │   ├── HeatmapCalendar.tsx
│   │   │   └── StreakBar.tsx
│   │   ├── dashboard/
│   │   │   ├── LifeScoreWidget.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── HabitTracker.tsx
│   │   │   └── WeeklySnapshot.tsx
│   │   ├── forms/
│   │   │   ├── DailyLogForm.tsx
│   │   │   └── HabitForm.tsx
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── redis.ts            # Upstash Redis client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── lifeScore.ts        # Life Score algorithm
│   │   ├── streaks.ts          # Streak computation
│   │   └── insights.ts        # AI insight helpers
│   ├── hooks/
│   │   ├── useMetrics.ts
│   │   ├── useHabits.ts
│   │   └── useLifeScore.ts
│   ├── store/
│   │   └── useDashboardStore.ts # Zustand store
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   └── styles/
│       └── globals.css
├── package.json
└── tsconfig.json
```

---

## 4. Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  image         String?
  password      String?   // hashed (email auth)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  metrics       DailyLog[]
  habits        Habit[]
  insights      Insight[]
  settings      UserSettings?
}

model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  timezone        String   @default("UTC")
  weeklyDigest    Boolean  @default(true)
  enabledMetrics  String[] // user-configurable metric keys
  theme           String   @default("dark")
}

model DailyLog {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  date         DateTime @db.Date         // only date, no time
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Core metrics (nullable for flexible logging)
  sleepHours      Float?
  waterLiters     Float?
  studyHours      Float?
  exerciseMinutes Int?
  mood            Int?     // 1–10 scale
  screenTimeHours Float?
  caloriesConsumed Int?
  stepsCount      Int?
  meditationMins  Int?
  socialTime      Float?

  // Dynamic custom metrics (JSON blob, key-value pairs)
  customMetrics   Json?    // { "journalPages": 3, "guitar_practice": 30 }

  lifeScore       Float?   // computed & cached

  @@unique([userId, date])
}

model Habit {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  name        String
  icon        String?   // emoji or icon key
  category    String    // health, focus, fitness, personal
  targetValue Float     // e.g. 8 hours sleep, 2L water
  unit        String    // hours, liters, minutes, boolean
  frequency   String    @default("daily")   // daily | weekly
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())

  logs        HabitLog[]
}

model HabitLog {
  id        String   @id @default(cuid())
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id])
  date      DateTime @db.Date
  value     Float    // actual logged value
  completed Boolean  // value >= target
  streak    Int      @default(0)

  @@unique([habitId, date])
}

model Insight {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // weekly_summary | ai_tip | correlation | prediction
  title     String
  body      String
  data      Json?    // supporting chart data
  week      Int?     // ISO week number
  year      Int?
  createdAt DateTime @default(now())
  isRead    Boolean  @default(false)
}
```

---

## 5. API Design

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Email/password registration |
| POST | `/api/auth/[...nextauth]` | NextAuth handlers (OAuth, session) |

### Daily Logs (Metrics)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/metrics?from=&to=` | Fetch logs (date range) |
| POST | `/api/metrics` | Create/update today's log |
| GET | `/api/metrics/:id` | Single log |
| PUT | `/api/metrics/:id` | Update log |
| DELETE | `/api/metrics/:id` | Delete log |

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | All user habits |
| POST | `/api/habits` | Create new habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| POST | `/api/habits/:id/log` | Log a habit entry for a date |

### Insights & Score
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/insights` | Fetch AI/rule insights |
| GET | `/api/score?date=` | Compute & return Life Score |
| GET | `/api/score/history?days=30` | Score trend array |

### Settings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update (metrics, theme, timezone) |

---

## 6. UI Pages

| Page | Path | Description |
|---|---|---|
| **Landing** | `/` | Immersive 3D animated intro, hero, features, CTA |
| **Login** | `/login` | Glassmorphism auth card, OAuth + email |
| **Register** | `/register` | Same style auth card |
| **Dashboard** | `/dashboard` | Main hub with widgets (Life Score, habits, trends) |
| **Daily Log** | `/dashboard/log` | Input form for today's metrics |
| **Habits** | `/dashboard/habits` | Manage habit library, toggle active |
| **History** | `/dashboard/history` | Calendar heatmap, trend lines, date picker |
| **Insights** | `/dashboard/insights` | Weekly digest cards, AI tips, correlations |
| **Settings** | `/dashboard/settings` | Manage metrics, theme, notifications |

---

## 7. Dashboard Widgets

| Widget | Description |
|---|---|
| **🔢 Life Score Globe** | Animated 3D globe/orb that shows 0–100 score |
| **📊 Radar Chart** | Spider/radar showing all metric categories vs. ideal |
| **🔥 Streak Cards** | Habit streaks with fire animation, longest/current |
| **📅 Heatmap Calendar** | GitHub-style year heatmap colored by Life Score |
| **📈 Trend Line** | 7/30/90 day trend for each metric |
| **💧 Today's Log Status** | Completion ring (how many metrics logged today) |
| **🧠 Weekly Insight Card** | Auto-generated tip/correlation from last 7 days |
| **🏆 Top Habits** | Best-performing habits this week with delta badges |
| **⚡ Quick Log** | One-click fast entry for common daily metrics |

---

## 8. Life Score Algorithm

The **Life Score** is a weighted composite score (0–100) computed per day.

### Categories & Weights

```
LIFE SCORE = Σ (category_score × weight)

Category         Weight   Metrics Included
─────────────────────────────────────────────────
🛏 Sleep          20%     sleepHours (ideal: 7–9h)
🏋 Fitness        20%     exercise (ideal: 30min+), steps (10k)
🧠 Focus          20%     studyHours (ideal: 4h+), screenTime (penalty)
💧 Health         15%     water (2L+), calories in range
😊 Mood           15%     mood score (1–10)
🧘 Mindfulness     10%    meditationMins (10min+)
👥 Social          10%    socialTime

Each metric → normalized 0–1 → multiplied by weight → summed → ×100
```

### Normalization Formula
```
score = clamp(actual / ideal, 0, 1)    -- Most metrics
score = 1 - clamp(actual / max, 0, 1)  -- Penalty metrics (screenTime)
```

### Streak Bonus
```
If currentStreak >= 7 days:  +2 points bonus
If currentStreak >= 30 days: +5 points bonus
(Capped at 100 total)
```

### Implementation (`src/lib/lifeScore.ts`)
```typescript
export function computeLifeScore(log: DailyLog): number {
  const categories = {
    sleep:  scoreSleep(log.sleepHours),
    fitness: scoreFitness(log.exerciseMinutes, log.stepsCount),
    focus:  scoreFocus(log.studyHours, log.screenTimeHours),
    health: scoreHealth(log.waterLiters, log.caloriesConsumed),
    mood:   scoreMood(log.mood),
    mindfulness: scoreMindfulness(log.meditationMins),
    social: scoreSocial(log.socialTime),
  };
  const weights = { sleep:.20, fitness:.20, focus:.20, health:.15, mood:.15, mindfulness:.10, social:.10 };
  const raw = Object.keys(weights).reduce((sum, k) =>
    sum + categories[k] * weights[k], 0);
  return Math.min(100, Math.round(raw * 100));
}
```

---

## 9. 3D / Visual Design System

### Landing Page 3D Scene (Three.js / R3F)
- **Floating particle orbs** representing different life metrics
- **Animated data globe** as the hero visual
- **Glassmorphism cards** floating in 3D space
- **Scroll-triggered animations** (camera moves deeper into scene)
- **Ambient light + HDR environment** for photorealistic feel

### Dashboard Aesthetic
- **Dark mode** with deep navy/purple gradient background
- **Neon glow accents** (cyan, violet, emerald) on cards
- **Glassmorphism** panels (`backdrop-blur`, `bg-opacity`)
- **Framer Motion** page transitions and widget entrance animations
- **Three.js Life Score Orb** — pulsing sphere with score number

### Color Palette
```
Background:  #0a0e1a  (deep navy)
Surface:     rgba(255,255,255,0.05)  (glass)
Primary:     #6366f1  (indigo)
Accent:      #22d3ee  (cyan)
Success:     #10b981  (emerald)
Warning:     #f59e0b  (amber)
Danger:      #ef4444  (red)
```

---

## 10. Future Features Roadmap

### Phase 2 – AI Insights Engine
- **Weekly AI Summary**: Send log data to OpenAI GPT-4o → generate personalized insights
- **Correlation Analysis**: Detect `sleep ↔ mood`, `exercise ↔ focus` correlations using Pearson coefficient on 30-day rolling windows
- **Habit Predictions**: Train a simple LSTM/linear regression on per-user data to predict tomorrow's likelihood of completing each habit
- **Smart Recommendations**: Rule engine + GPT-4o → "You sleep better when you exercise before 6PM"

### Phase 3 – Social & Gamification
- Public profile page with shareable Life Score card
- Accountability partner challenges
- Achievement badges and level system

### Phase 4 – Integrations
- Apple Health / Google Fit sync via REST APIs
- Wearable device data (Fitbit, Garmin)
- Calendar integration for automatic study/work hour tracking
- Spotify API for mood-based music stats

---

## 11. Deployment Plan

```
Development:   localhost:3000 (next dev)
Staging:       Vercel Preview (auto on PR)
Production:    Vercel Production
Database:      Supabase (managed PostgreSQL)
Redis:         Upstash (serverless)
Email:         Resend (transactional)
Domain:        Custom domain on Vercel
SSL:           Automatic via Vercel
```

### Environment Variables Required
```env
DATABASE_URL=
DIRECT_URL=          # Supabase direct connection for migrations
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
RESEND_API_KEY=
OPENAI_API_KEY=      # Phase 2
```

---

## 12. Development Phases

| Phase | Focus | Duration |
|---|---|---|
| **Phase 1** | Auth + DB + Basic Log + Dashboard skeleton | 2–3 weeks |
| **Phase 2** | All widgets + charts + Life Score | 2–3 weeks |
| **Phase 3** | Habits + Streaks + History | 1–2 weeks |
| **Phase 4** | 3D Landing + design polish | 1–2 weeks |
| **Phase 5** | AI Insights + Weekly Digest emails | 2–3 weeks |
| **Phase 6** | Testing + Deployment + Domain | 1 week |
