# Changelog

All notable changes to Quizu are documented in this file.

## [1.0.0] - 2026-04-14

### Added
- **Core platform**: Next.js 16 App Router with TypeScript, Tailwind CSS v4, Prisma 6, Neon Postgres
- **Quiz types**: Personality, Trivia, Polls, Lists, Would You Rather
- **Data import**: 33,844 quizzes + 217,762 questions imported from legacy MySQL database
- **Premium content**: 40+ hand-crafted quizzes (personality, trivia, sports, science, entertainment, music, history, geography)
- **Authentication**: NextAuth v5 with credentials provider (email/password, bcrypt)
- **Comments system**: Auth-gated threaded comments with replies, +5 points per comment
- **Points system**: +10 pts per quiz completion, +5 per comment, +3 per share. Points displayed in navbar.
- **Badge system**: 24 badges across 5 rarity tiers (Common to Legendary) with hilarious names (Golden Chicken, Quiz God, Founding Chicken)
- **User profiles**: `/profile/[username]` with avatar, level, XP bar, badges, created quizzes
- **Admin panel**: `/admin` with stats dashboard, quiz management (publish/unpublish/delete), user table
- **SEO infrastructure**: Flat URLs via Next.js rewrites, dynamic meta tags, OG tags, topic pages with editorial content
- **Clean URLs**: `/personality`, `/trivia`, `/polls`, `/would-you-rather`, `/[quiz-slug]`
- **Sortable tables**: Interactive tables with sort by title/type/played/views, gold/silver/bronze ranks, popularity bars, hot indicators
- **Gamified design**: XP bars, rank medals, play buttons, stacked hero cards, game-card hover effects, grid pattern backgrounds
- **Quiz interactions**: All-at-once layout for personality, confetti on correct trivia answers, screen shake on wrong, streak counter
- **Topic pages**: 9 categories with editorial SEO content, fun facts, breadcrumbs
- **Category management**: Cleaned up 16 irrelevant legacy categories, kept 9 modern ones with content
- **Responsive design**: Mobile-first with sticky nav, category bar, collapsible mobile menu

### Technical
- Prisma schema with 18 models and foreign key relationships
- Flat URL routing via `next.config.ts` rewrites
- Server Components for data fetching, Client Components for interactivity
- Dynamic metadata generation on all pages
- Stagger entrance animations with CSS keyframes
- Game-card hover effects with gradient underline wipes

## [0.1.0] - 2026-04-14

### Added
- Initial project scaffolding from `create-next-app`
- Prisma schema based on legacy Quizu-Update PHP app (wrong repo)
- Basic quiz card layout and browse page

### Changed
- Rebuilt entirely from correct Quizu repo (github.com/iancorbin/Quizu)
- Imported real quizudb MySQL dump into Neon Postgres
