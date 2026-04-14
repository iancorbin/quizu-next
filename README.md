# Quizu

A modern quiz platform with 33,000+ quizzes — personality tests, trivia challenges, polls, and more. Built with Next.js 16, Prisma, Neon Postgres, and NextAuth.

**Live:** [quizu-next.vercel.app](https://quizu-next.vercel.app)

## Features

- **Quiz Types:** Personality, Trivia, Polls, Lists, Would You Rather
- **33,800+ quizzes** imported from legacy database + 40+ hand-crafted premium quizzes
- **Gamification:** Points system, 24 badges across 5 rarity tiers, XP bars, level system
- **Social:** Comments (auth-gated), user profiles with badges and stats
- **Interactive:** All-at-once quiz layout, confetti on correct answers, shake on wrong, streak counter
- **SEO:** Flat URLs (`/quiz-slug`), dynamic meta tags, topic pages with editorial content
- **Admin:** Dashboard with quiz publish/unpublish/delete, user management, stats

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| Database | Neon (serverless Postgres, free tier) |
| ORM | Prisma 6 |
| Auth | NextAuth v5 (credentials provider) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Hosting | Vercel |
| Fonts | Sora (display), DM Sans (body), JetBrains Mono (code) |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and NEXTAUTH_SECRET

# Push schema to database
npx prisma db push

# Seed premium content
npx tsx prisma/seed-premium.ts
npx tsx prisma/seed-seo.ts
npx tsx prisma/seed-trivia-batch.ts
npx tsx prisma/seed-sports.ts
npx tsx prisma/seed-badges.ts

# Run dev server
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── personality/          # /personality
│   ├── trivia/               # /trivia
│   ├── polls/                # /polls
│   ├── would-you-rather/     # /would-you-rather
│   ├── browse/               # /browse (all quizzes + filters)
│   ├── quiz/[slug]/          # Quiz detail + player
│   ├── topic/[slug]/         # Topic/category pages
│   ├── badges/               # Badge collection
│   ├── profile/[username]/   # User profiles
│   ├── admin/                # Admin dashboard
│   ├── auth/                 # Sign in / Sign up
│   └── api/                  # API routes (auth, comments, points, admin)
├── components/               # 18 React components
├── lib/                      # Prisma client, auth config, utils, type themes
└── types/                    # TypeScript declarations
```

## Database Schema

18 Prisma models including: QuizMeta, QuizPersonalityQuestion/Answer/Result, QuizTriviaQuestion/Answer, PollAnswer/Response, ListAnswer, WouldYouRatherAnswer/Response, User, Comment, Badge, UserBadge, Category, and tracking tables.

## Admin Access

Sign in at `/auth/signin` with admin credentials, then visit `/admin`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## License

Private repository.
