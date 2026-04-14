# Architecture

## System Design

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel     │────▶│  Next.js 16  │────▶│  Neon DB     │
│  (CDN/Edge)  │     │  App Router  │     │  (Postgres)  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  NextAuth   │
                    │  (JWT/Cred) │
                    └─────────────┘
```

## Data Flow

1. **Page load:** Server Component fetches data via Prisma → renders HTML → streams to client
2. **Quiz interaction:** Client Component manages state → submits to API route → Prisma writes to Neon
3. **Auth:** NextAuth JWT strategy → credentials provider → bcrypt password verification against User table
4. **Flat URLs:** `next.config.ts` rewrites `/quiz-slug` → `/quiz/quiz-slug` before file-system routing

## Route Architecture

### Pages (Server Components)
| Route | Component | Data |
|---|---|---|
| `/` | Homepage | Featured + latest quizzes, categories |
| `/personality` | TypePage | Personality quizzes |
| `/trivia` | TypePage | Trivia quizzes |
| `/polls` | TypePage | Poll quizzes |
| `/would-you-rather` | TypePage | WYR quizzes |
| `/browse` | BrowsePage | All quizzes with filters |
| `/quiz/[slug]` | QuizPage | Quiz detail + type-specific player |
| `/topic/[slug]` | TopicPage | Category quizzes + SEO content |
| `/badges` | BadgesPage | All badges by rarity |
| `/profile/[username]` | ProfilePage | User stats + badges + quizzes |
| `/admin` | AdminPage | Stats + quiz/user management |

### API Routes
| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | — | NextAuth handlers |
| `/api/auth/signup` | POST | — | User registration |
| `/api/quiz/[id]/comments` | GET, POST | Optional | Read/write comments |
| `/api/points/earn` | GET, POST | Required | Read balance / earn points |
| `/api/admin/quiz/[id]` | PATCH, DELETE | Admin | Publish/delete quizzes |

## Component Architecture

### Server Components (data fetching)
- `TypePage` — shared type page with theme system
- All page.tsx files

### Client Components (interactivity)
- `PersonalityPlayer` — all-at-once quiz with auto-scroll, result reveal
- `TriviaPlayer` — one-at-a-time with confetti/shake, streak, score
- `PollPlayer` — vote + animated percentage bars
- `ListViewer` — ranked list display
- `WYRPlayer` — binary choice
- `SortableTable` — interactive column sorting
- `QuizGrid` — card grid with hover effects
- `CommentSection` — threaded comments
- `CategoryBar` — horizontal scroll filter
- `Navbar` — auth state + points

## Database Schema (18 models)

### Core
- `QuizMeta` — master quiz record (type, title, url, views, taken, etc.)
- `Category` — topic categories

### Quiz Content
- `QuizPersonalityQuestion` → `QuizPersonalityAnswer` → `QuizPersonalityResult`
- `QuizTriviaQuestion` → `QuizTriviaAnswer`
- `PollAnswer` → `PollResponse`
- `ListAnswer`
- `WouldYouRatherAnswer` → `WouldYouRatherResponse`

### Social
- `User` (username, email, password, points, role)
- `Comment` (threaded, auth-gated)
- `Badge` → `UserBadge`

### Tracking
- `QuizResultsLog`, `UserTaken`
- `MetaComment`, `MetaLove`, `MetaReact`, `MetaTag`, `MetaCategory`
