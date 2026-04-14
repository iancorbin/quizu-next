import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const password = await hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@quizu.com" },
    update: {},
    create: {
      username: "demo",
      email: "demo@quizu.com",
      password,
      name: "Demo User",
    },
  });

  // Create categories
  const categories = await Promise.all(
    [
      { name: "Personality", slug: "personality", icon: "🧠", order: 0 },
      { name: "Entertainment", slug: "entertainment", icon: "🎬", order: 1 },
      { name: "Science", slug: "science", icon: "🔬", order: 2 },
      { name: "History", slug: "history", icon: "📜", order: 3 },
      { name: "Pop Culture", slug: "pop-culture", icon: "🎵", order: 4 },
    ].map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  // Create a sample quiz
  await prisma.quiz.upsert({
    where: { slug: "what-element-are-you" },
    update: {},
    create: {
      title: "What Element Are You?",
      slug: "what-element-are-you",
      description:
        "Discover which classical element matches your personality — Fire, Water, Earth, or Air.",
      authorId: user.id,
      categoryId: categories[0].id,
      status: "published",
      featured: true,
      results: {
        create: [
          {
            key: "A",
            title: "Fire 🔥",
            description:
              "You are passionate, energetic, and a natural leader. You light up every room you enter.",
          },
          {
            key: "B",
            title: "Water 🌊",
            description:
              "You are calm, intuitive, and deeply emotional. You adapt to any situation with grace.",
          },
          {
            key: "C",
            title: "Earth 🌍",
            description:
              "You are grounded, reliable, and practical. People depend on you for your steady nature.",
          },
          {
            key: "D",
            title: "Air 💨",
            description:
              "You are intellectual, curious, and free-spirited. Your ideas inspire those around you.",
          },
        ],
      },
      questions: {
        create: [
          {
            title: "How do you handle a stressful situation?",
            order: 0,
            options: {
              create: [
                { title: "Take charge and lead others through it", resultKey: "A" },
                { title: "Stay calm and go with the flow", resultKey: "B" },
                { title: "Create a practical plan step by step", resultKey: "C" },
                { title: "Think creatively for a unique solution", resultKey: "D" },
              ],
            },
          },
          {
            title: "What is your ideal weekend activity?",
            order: 1,
            options: {
              create: [
                { title: "An exciting adventure or competition", resultKey: "A" },
                { title: "Relaxing by the ocean or a lake", resultKey: "B" },
                { title: "Gardening or a cozy day at home", resultKey: "C" },
                { title: "Exploring a museum or reading a book", resultKey: "D" },
              ],
            },
          },
          {
            title: "Pick a superpower:",
            order: 2,
            options: {
              create: [
                { title: "Super strength", resultKey: "A" },
                { title: "Healing powers", resultKey: "B" },
                { title: "Invulnerability", resultKey: "C" },
                { title: "Telekinesis", resultKey: "D" },
              ],
            },
          },
          {
            title: "How would your friends describe you?",
            order: 3,
            options: {
              create: [
                { title: "Bold and confident", resultKey: "A" },
                { title: "Empathetic and caring", resultKey: "B" },
                { title: "Dependable and loyal", resultKey: "C" },
                { title: "Witty and clever", resultKey: "D" },
              ],
            },
          },
          {
            title: "What draws you to a new place?",
            order: 4,
            options: {
              create: [
                { title: "The energy and nightlife", resultKey: "A" },
                { title: "The beaches and nature", resultKey: "B" },
                { title: "The culture and traditions", resultKey: "C" },
                { title: "The architecture and history", resultKey: "D" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed complete: 1 user, 5 categories, 1 quiz with 5 questions");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
