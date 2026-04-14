import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const badges = [
  // ─── COMMON (Easy to get) ─────────────────────────
  { slug: "baby-quizzer", name: "Baby Quizzer", emoji: "🍼", rarity: "common", category: "activity",
    description: "Took your very first quiz. Welcome to the addiction.", requirement: "Take 1 quiz", threshold: 1 },
  { slug: "chatty-chicken", name: "Chatty Chicken", emoji: "🐔", rarity: "common", category: "social",
    description: "Left your first comment. Bawk bawk!", requirement: "Post 1 comment", threshold: 1 },
  { slug: "point-collector", name: "Point Hoarder", emoji: "🐿️", rarity: "common", category: "activity",
    description: "Collected 50 points. You're basically a squirrel now.", requirement: "Earn 50 points", threshold: 50 },

  // ─── UNCOMMON ─────────────────────────────────────
  { slug: "quiz-curious", name: "Quiz Curious", emoji: "🔍", rarity: "uncommon", category: "activity",
    description: "Took 10 quizzes. You're officially curious.", requirement: "Take 10 quizzes", threshold: 10 },
  { slug: "big-brain-energy", name: "Big Brain Energy", emoji: "🧠", rarity: "uncommon", category: "achievement",
    description: "Scored perfect on a trivia quiz. Your brain is massive.", requirement: "Score 100% on any trivia", threshold: 1 },
  { slug: "smooth-talker", name: "Smooth Talker", emoji: "🗣️", rarity: "uncommon", category: "social",
    description: "Posted 10 comments. You have opinions and you WILL share them.", requirement: "Post 10 comments", threshold: 10 },
  { slug: "identity-crisis", name: "Identity Crisis", emoji: "🪞", rarity: "uncommon", category: "activity",
    description: "Took 5 personality quizzes. Still figuring yourself out, huh?", requirement: "Take 5 personality quizzes", threshold: 5 },
  { slug: "point-goblin", name: "Point Goblin", emoji: "👺", rarity: "uncommon", category: "activity",
    description: "Hoarded 500 points. You're becoming a goblin.", requirement: "Earn 500 points", threshold: 500 },

  // ─── RARE ─────────────────────────────────────────
  { slug: "golden-chicken", name: "The Golden Chicken", emoji: "🐓", rarity: "rare", category: "social",
    description: "Your comment got 10 replies. You started something beautiful (or terrible).", requirement: "Get 10 replies on a comment", threshold: 10 },
  { slug: "quiz-addict", name: "Quiz Addict", emoji: "💉", rarity: "rare", category: "activity",
    description: "Took 50 quizzes. We're concerned. But also impressed.", requirement: "Take 50 quizzes", threshold: 50 },
  { slug: "streak-master", name: "Streak Master", emoji: "🔥", rarity: "rare", category: "achievement",
    description: "Got a 5-answer streak in trivia. You're literally on fire.", requirement: "5 correct answers in a row", threshold: 5 },
  { slug: "renaissance-quizzer", name: "Renaissance Quizzer", emoji: "🎨", rarity: "rare", category: "activity",
    description: "Took quizzes in 5 different categories. A true polymath.", requirement: "Take quizzes in 5 categories", threshold: 5 },
  { slug: "night-owl", name: "Night Owl", emoji: "🦉", rarity: "rare", category: "secret",
    description: "Took a quiz between 2am and 5am. Go to sleep.", requirement: "Take a quiz at 2-5am", threshold: 1 },
  { slug: "point-dragon", name: "Point Dragon", emoji: "🐉", rarity: "rare", category: "activity",
    description: "Amassed 2,000 points. You're sitting on a hoard.", requirement: "Earn 2,000 points", threshold: 2000 },

  // ─── EPIC ─────────────────────────────────────────
  { slug: "quiz-maniac", name: "Quiz Maniac", emoji: "🤪", rarity: "epic", category: "activity",
    description: "Took 200 quizzes. Your friends are worried. We're proud.", requirement: "Take 200 quizzes", threshold: 200 },
  { slug: "brain-surgeon", name: "Brain Surgeon", emoji: "🧬", rarity: "epic", category: "achievement",
    description: "Scored perfect on 5 different trivia quizzes. You're basically a genius.", requirement: "5 perfect trivia scores", threshold: 5 },
  { slug: "social-butterfly", name: "Social Butterfly", emoji: "🦋", rarity: "epic", category: "social",
    description: "Posted 100 comments. You should run for office.", requirement: "Post 100 comments", threshold: 100 },
  { slug: "diamond-hands", name: "Diamond Hands", emoji: "💎", rarity: "epic", category: "activity",
    description: "Earned 10,000 points. Your hands are literally diamonds now.", requirement: "Earn 10,000 points", threshold: 10000 },
  { slug: "completionist", name: "The Completionist", emoji: "🏅", rarity: "epic", category: "activity",
    description: "Took every type of quiz (personality, trivia, poll, list, WYR). You did it all.", requirement: "Take all quiz types", threshold: 5 },

  // ─── LEGENDARY ────────────────────────────────────
  { slug: "quiz-god", name: "Quiz God", emoji: "👑", rarity: "legendary", category: "activity",
    description: "Took 1,000 quizzes. You have ascended. You ARE the quiz now.", requirement: "Take 1,000 quizzes", threshold: 1000 },
  { slug: "omega-brain", name: "Omega Brain", emoji: "🌌", rarity: "legendary", category: "achievement",
    description: "Scored perfect on 20 trivia quizzes. NASA is calling. Answer the phone.", requirement: "20 perfect trivia scores", threshold: 20 },
  { slug: "the-oracle", name: "The Oracle", emoji: "🔮", rarity: "legendary", category: "secret",
    description: "Unlocked 15 other badges. You see the matrix. You ARE the matrix.", requirement: "Earn 15 badges", threshold: 15 },
  { slug: "point-singularity", name: "Point Singularity", emoji: "⚫", rarity: "legendary", category: "activity",
    description: "Earned 100,000 points. You've created a gravitational anomaly. Scientists are baffled.", requirement: "Earn 100,000 points", threshold: 100000 },
  { slug: "founding-chicken", name: "Founding Chicken", emoji: "🐔👑", rarity: "legendary", category: "secret",
    description: "One of the first 100 users to join Quizu. You were here before it was cool.", requirement: "Be among first 100 users", threshold: 100 },
];

async function main() {
  console.log(`Seeding ${badges.length} badges...`);
  for (const b of badges) {
    const existing = await prisma.badge.findUnique({ where: { slug: b.slug } });
    if (existing) { console.log(`  Skip: ${b.name}`); continue; }
    await prisma.badge.create({ data: b });
    console.log(`  ✓ [${b.rarity.toUpperCase()}] ${b.emoji} ${b.name}`);
  }
  console.log("\nDone!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
