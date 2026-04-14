import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Delete irrelevant categories with 0 quizzes
  const toDelete = [
    "election2012", "skylanders", "mlb", "nba", "hetalia", "90s",
    "vampireweekend", "wrestling", "wwe", "dudes", "babes",
    "gaming", "twilight", "celebrities", "harry potter", "popculture",
  ];

  for (const term of toDelete) {
    const result = await prisma.category.deleteMany({ where: { term } });
    if (result.count > 0) console.log(`  Deleted: ${term}`);
  }

  // Update existing categories with better descriptions
  const updates: Record<string, { title: string; description: string }> = {
    personality: { title: "Personality", description: "Discover who you really are with personality quizzes that reveal your hidden traits, preferences, and quirks." },
    entertainment: { title: "Entertainment", description: "Movies, TV shows, gaming, and everything pop culture. Test your entertainment knowledge." },
    lifestyle: { title: "Lifestyle", description: "Food, travel, relationships, and the choices that define your daily life." },
    technology: { title: "Technology", description: "From coding to gadgets to internet history. How tech-savvy are you really?" },
    science: { title: "Science & Nature", description: "Biology, physics, chemistry, space, and the natural world. How much do you actually know?" },
    history: { title: "History", description: "From ancient civilizations to modern events. Test your knowledge of the past." },
    music: { title: "Music", description: "Lyrics, artists, genres, and eras. How deep does your music knowledge go?" },
    movies: { title: "Movies & TV", description: "From classic cinema to streaming hits. Are you a true screen junkie?" },
    sports: { title: "Sports", description: "Football, basketball, soccer, and beyond. Test your sports IQ." },
  };

  for (const [term, data] of Object.entries(updates)) {
    await prisma.category.updateMany({ where: { term }, data });
    console.log(`  Updated: ${term} → ${data.title}`);
  }

  console.log("\nDone!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
