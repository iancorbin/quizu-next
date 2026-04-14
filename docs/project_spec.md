# Project Specification

## Overview

Quizu is a social quiz platform modernized from a legacy PHP/MySQL application. It supports multiple quiz formats, gamification, and community features.

## Quiz Types

| Type | Format | Data Model |
|---|---|---|
| Personality | Answer all questions → get matched result | QuizPersonalityQuestion → Answer → Result |
| Trivia | One-at-a-time → score based on correct | QuizTriviaQuestion → Answer (correct field) |
| Poll | Vote on options → see percentages | PollAnswer → PollResponse |
| List | View ranked items | ListAnswer |
| Would You Rather | Binary choice | WouldYouRatherAnswer → Response |

## URL Structure

- `/` — Homepage
- `/personality`, `/trivia`, `/polls`, `/would-you-rather` — Type pages
- `/browse` — All quizzes with type/category filters, grid/table view toggle
- `/[quiz-slug]` — Flat quiz URL (rewrites to `/quiz/[slug]`)
- `/quiz/[slug]` — Quiz detail (also works directly)
- `/topic/[slug]` — Topic/category page
- `/badges` — Badge collection
- `/profile/[username]` — User profile
- `/admin` — Admin dashboard (requires admin role)
- `/auth/signin`, `/auth/signup` — Authentication

## API Endpoints

### `POST /api/auth/signup`
Creates a new user account.
- Body: `{ username, email, password }`
- Validates with zod (username 3-30 chars, valid email, password 6+ chars)
- Returns 201 on success, 409 if username/email taken

### `GET /api/quiz/[id]/comments`
Fetches comments for a quiz (top-level + nested replies).

### `POST /api/quiz/[id]/comments`
Creates a comment. Requires authentication.
- Body: `{ message, parentId? }`
- Awards +5 points to authenticated user

### `GET /api/points/earn`
Returns current user's point balance.

### `POST /api/points/earn`
Awards points to authenticated user.
- Body: `{ type: "quiz_complete" | "comment" | "share", quizId? }`
- Points: quiz_complete=10, comment=5, share=3

### `PATCH /api/admin/quiz/[id]`
Updates quiz published status. Requires admin role.
- Body: `{ published: "1" | "2" }`

### `DELETE /api/admin/quiz/[id]`
Deletes a quiz. Requires admin role.

## Data Models

See `prisma/schema.prisma` for the complete schema (18 models).

Key models:
- **QuizMeta** — Central quiz record. `published="2"` means live. `type` determines quiz format.
- **User** — `role` field ("user" | "admin"), `points` field for gamification.
- **Comment** — Self-referential `parentId` for threaded replies. FK to User and QuizMeta.
- **Badge** — `rarity` (common/uncommon/rare/epic/legendary), `threshold` for earn conditions.
- **UserBadge** — Join table with `@@unique([userId, badgeId])`.

## Gamification

### Points
| Action | Points |
|---|---|
| Complete a quiz | +10 |
| Post a comment | +5 |
| Share a result | +3 |

### Levels
- Level = floor(points / 100) + 1
- XP in current level = points % 100

### Badges (24 total)
- **Common (3):** Baby Quizzer, Chatty Chicken, Point Hoarder
- **Uncommon (5):** Quiz Curious, Big Brain Energy, Smooth Talker, Identity Crisis, Point Goblin
- **Rare (6):** Golden Chicken, Quiz Addict, Streak Master, Renaissance Quizzer, Night Owl, Point Dragon
- **Epic (5):** Quiz Maniac, Brain Surgeon, Social Butterfly, Diamond Hands, Completionist
- **Legendary (5):** Quiz God, Omega Brain, The Oracle, Point Singularity, Founding Chicken

## SEO Strategy

- Flat URLs (`/quiz-title-slug`) for max search indexing
- Dynamic `<title>` and `<meta description>` on every page
- Topic pages with editorial intro, fun facts, and footer SEO content
- Breadcrumb navigation
- OpenGraph tags for social sharing
