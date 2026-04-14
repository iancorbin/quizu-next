import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const premiumQuizzes = [
  {
    title: "What Kind of Creative Are You?",
    description: "Every person has a unique creative signature. Discover yours — from visionary dreamer to meticulous architect.",
    type: "personality",
    url: "what-kind-of-creative-are-you",
    category: "personality",
    tags: "creative,personality,art,design",
    questions: [
      {
        question: "You have a free Saturday. What sounds most appealing?",
        answers: [
          { answer: "Visiting a museum or gallery for inspiration", resultIdx: 0 },
          { answer: "Building something with my hands", resultIdx: 1 },
          { answer: "Writing in a journal at a coffee shop", resultIdx: 2 },
          { answer: "Reorganizing and redesigning my living space", resultIdx: 3 },
        ],
      },
      {
        question: "When faced with a problem, you tend to...",
        answers: [
          { answer: "Brainstorm wildly until something clicks", resultIdx: 0 },
          { answer: "Prototype and test solutions quickly", resultIdx: 1 },
          { answer: "Research deeply before making a move", resultIdx: 2 },
          { answer: "Create a structured plan with clear steps", resultIdx: 3 },
        ],
      },
      {
        question: "Which workspace sounds ideal?",
        answers: [
          { answer: "A messy studio full of colors and textures", resultIdx: 0 },
          { answer: "A maker space with tools and materials", resultIdx: 1 },
          { answer: "A quiet library with endless books", resultIdx: 2 },
          { answer: "A minimalist desk with everything in its place", resultIdx: 3 },
        ],
      },
      {
        question: "Your friends come to you when they need...",
        answers: [
          { answer: "A fresh perspective or wild idea", resultIdx: 0 },
          { answer: "Something fixed, built, or made", resultIdx: 1 },
          { answer: "Deep conversation and thoughtful advice", resultIdx: 2 },
          { answer: "A well-organized plan or system", resultIdx: 3 },
        ],
      },
      {
        question: "Which quote resonates most?",
        answers: [
          { answer: "\"Imagination is the beginning of creation.\"", resultIdx: 0 },
          { answer: "\"The best way to predict the future is to build it.\"", resultIdx: 1 },
          { answer: "\"The unexamined life is not worth living.\"", resultIdx: 2 },
          { answer: "\"Good design is as little design as possible.\"", resultIdx: 3 },
        ],
      },
    ],
    results: [
      { title: "The Visionary Dreamer", description: "You see the world differently. Your creativity lives in ideas, concepts, and possibilities that others haven't imagined yet. You're the one who sees the big picture before anyone else." },
      { title: "The Maker", description: "You bring ideas to life with your hands. Whether it's code, crafts, or cooking — you thrive when you're building something tangible. Your creativity is kinetic." },
      { title: "The Deep Thinker", description: "Your creativity flows through words, analysis, and understanding. You find meaning in patterns others miss and express yourself through thoughtful, nuanced work." },
      { title: "The Architect", description: "You bring order to chaos. Your creative gift is designing systems, spaces, and experiences that just work. Beauty, to you, is elegant simplicity." },
    ],
  },
  {
    title: "Which Decade Should You Have Been Born In?",
    description: "Your soul belongs to a different era. Take this quiz to find out which decade matches your true vibe.",
    type: "personality",
    url: "which-decade-should-you-have-been-born-in",
    category: "personality",
    tags: "decade,nostalgia,era,personality",
    questions: [
      {
        question: "Pick a way to spend Friday night:",
        answers: [
          { answer: "Dancing at a disco or roller rink", resultIdx: 0 },
          { answer: "Going to a rock concert or underground club", resultIdx: 1 },
          { answer: "Binge-watching a new series with friends", resultIdx: 2 },
          { answer: "Hosting a dinner party with curated playlists", resultIdx: 3 },
        ],
      },
      {
        question: "Your fashion sense leans toward:",
        answers: [
          { answer: "Bold colors, patterns, and statement pieces", resultIdx: 0 },
          { answer: "Grunge, band tees, and effortless cool", resultIdx: 1 },
          { answer: "Streetwear and athleisure", resultIdx: 2 },
          { answer: "Vintage-inspired with modern twists", resultIdx: 3 },
        ],
      },
      {
        question: "How do you document memories?",
        answers: [
          { answer: "Polaroids and scrapbooks", resultIdx: 0 },
          { answer: "Mix tapes and journal entries", resultIdx: 1 },
          { answer: "Instagram stories and TikToks", resultIdx: 2 },
          { answer: "Film photography and handwritten letters", resultIdx: 3 },
        ],
      },
      {
        question: "Your ideal car is:",
        answers: [
          { answer: "A classic muscle car with character", resultIdx: 0 },
          { answer: "A beat-up van for road trips", resultIdx: 1 },
          { answer: "A Tesla or something electric", resultIdx: 2 },
          { answer: "A restored vintage convertible", resultIdx: 3 },
        ],
      },
      {
        question: "Pick a life motto:",
        answers: [
          { answer: "\"Live fast, love hard\"", resultIdx: 0 },
          { answer: "\"Stay weird, stay real\"", resultIdx: 1 },
          { answer: "\"Work smart, vibe harder\"", resultIdx: 2 },
          { answer: "\"Less is more, but make it count\"", resultIdx: 3 },
        ],
      },
    ],
    results: [
      { title: "The 70s — Disco & Freedom", description: "You belong in the era of disco balls, bell bottoms, and liberation. You're a free spirit with infectious energy and a love for self-expression." },
      { title: "The 90s — Grunge & Authenticity", description: "You're a 90s soul — raw, real, and unapologetically yourself. You value substance over style and have a deep appreciation for counterculture." },
      { title: "The 2010s — Digital & Connected", description: "You're a child of the internet age. You thrive on connection, innovation, and the fast pace of modern life. You're adaptable and always ahead of the curve." },
      { title: "The 50s — Classic & Timeless", description: "You have an old soul with impeccable taste. You appreciate craftsmanship, elegance, and the things that stand the test of time." },
    ],
  },
  {
    title: "How Well Do You Know Internet Culture?",
    description: "From memes to viral moments — test your knowledge of the internet's greatest hits.",
    type: "trivia",
    url: "how-well-do-you-know-internet-culture",
    category: "entertainment",
    tags: "internet,memes,culture,trivia",
    questions: [
      { question: "What year was YouTube founded?", answers: [{ answer: "2003", correct: "" }, { answer: "2005", correct: "A" }, { answer: "2007", correct: "" }, { answer: "2004", correct: "" }] },
      { question: "Which video was the first to hit 1 billion views on YouTube?", answers: [{ answer: "Charlie Bit My Finger", correct: "" }, { answer: "Gangnam Style", correct: "A" }, { answer: "Baby Shark", correct: "" }, { answer: "Despacito", correct: "" }] },
      { question: "What does 'AMA' stand for on Reddit?", answers: [{ answer: "Ask Me Again", correct: "" }, { answer: "All My Answers", correct: "" }, { answer: "Ask Me Anything", correct: "A" }, { answer: "A Meaningful Answer", correct: "" }] },
      { question: "What was the original name of Twitter (now X)?", answers: [{ answer: "Twttr", correct: "A" }, { answer: "Birdie", correct: "" }, { answer: "Chirp", correct: "" }, { answer: "BlueBird", correct: "" }] },
      { question: "Which social media platform introduced 'Stories' first?", answers: [{ answer: "Instagram", correct: "" }, { answer: "Facebook", correct: "" }, { answer: "Snapchat", correct: "A" }, { answer: "WhatsApp", correct: "" }] },
    ],
    results: [],
  },
  {
    title: "Coffee or Tea — What Does Your Choice Say About You?",
    description: "Cast your vote and see where the world stands on the ultimate hot beverage debate.",
    type: "poll",
    url: "coffee-or-tea-what-does-your-choice-say",
    category: "lifestyle",
    tags: "coffee,tea,lifestyle,food",
    pollAnswers: [
      { title: "Coffee — I need the intensity", description: "Bold, caffeinated, and ready to conquer the day." },
      { title: "Tea — I prefer the ritual", description: "Calm, refined, and endlessly varied." },
      { title: "Both — depends on my mood", description: "Why choose when you can have it all?" },
      { title: "Neither — water gang", description: "Hydration is the only lifestyle." },
    ],
    questions: [], results: [],
  },
  {
    title: "Rate These Modern Inventions",
    description: "Which innovations actually changed your life? Rank the tech that matters most.",
    type: "list",
    url: "rate-these-modern-inventions",
    category: "technology",
    tags: "technology,inventions,ranking",
    listItems: [
      { title: "Smartphones", description: "The device that replaced your camera, GPS, alarm clock, and social life." },
      { title: "Streaming Services", description: "Netflix, Spotify, and the death of physical media." },
      { title: "Social Media", description: "Connected the world — for better or worse." },
      { title: "Electric Vehicles", description: "The future of transportation, today." },
      { title: "AI Assistants", description: "From Siri to ChatGPT — machines that talk back." },
      { title: "Food Delivery Apps", description: "Restaurant-quality meals without pants." },
      { title: "Wireless Earbuds", description: "Freedom from tangled cables, finally." },
      { title: "Smart Home Devices", description: "Lights, locks, and thermostats that listen." },
    ],
    questions: [], results: [],
  },
  {
    title: "Would You Rather: Impossible Choices",
    description: "No good answers here — just impossible dilemmas that reveal who you really are.",
    type: "vs",
    url: "would-you-rather-impossible-choices",
    category: "entertainment",
    tags: "wouldyourather,fun,choices",
    wyrPairs: [
      { a: "Be able to fly but only at walking speed", b: "Be invisible but only when no one is looking" },
    ],
    questions: [], results: [],
  },
];

async function main() {
  console.log("Creating premium quizzes...");

  for (const q of premiumQuizzes) {
    // Check if already exists
    const existing = await prisma.quizMeta.findFirst({ where: { url: q.url } });
    if (existing) {
      console.log(`  Skip (exists): ${q.title}`);
      continue;
    }

    const quiz = await prisma.quizMeta.create({
      data: {
        title: q.title,
        description: q.description,
        type: q.type,
        url: q.url,
        category: q.category || "",
        tags: q.tags || "",
        published: "2",
        timestamp: String(Math.floor(Date.now() / 1000)),
        username: "quizu",
        views: "0",
        taken: "0",
        loves: "0",
        rating: "",
        photo: "",
        photoBig: "",
        tagsEditorial: "",
        tagsUser: "",
        theme: "",
        ip: "",
      },
    });

    if (q.type === "personality" || q.type === "personalityalt") {
      // Create results first
      const resultIds: number[] = [];
      for (const r of q.results) {
        const res = await prisma.quizPersonalityResult.create({
          data: { quizId: quiz.id, title: r.title, description: r.description, photo: "" },
        });
        resultIds.push(res.id);
      }

      // Create questions and answers
      for (const qn of q.questions) {
        const question = await prisma.quizPersonalityQuestion.create({
          data: { quizId: quiz.id, question: qn.question, photo: "", video: "", username: "quizu" },
        });
        for (const a of qn.answers) {
          await prisma.quizPersonalityAnswer.create({
            data: {
              quizId: quiz.id,
              questionId: question.id,
              resultId: resultIds[a.resultIdx] || resultIds[0],
              answer: a.answer,
              photo: "",
              video: "",
              correct: "",
            },
          });
        }
      }
    } else if (q.type === "trivia") {
      for (const qn of q.questions) {
        const question = await prisma.quizTriviaQuestion.create({
          data: { quizId: quiz.id, question: qn.question, photo: "" },
        });
        for (const a of qn.answers) {
          await prisma.quizTriviaAnswer.create({
            data: { quizId: quiz.id, questionId: question.id, answer: a.answer, correct: a.correct, photo: "" },
          });
        }
      }
    } else if (q.type === "poll" && q.pollAnswers) {
      for (const a of q.pollAnswers) {
        await prisma.pollAnswer.create({
          data: { quizId: quiz.id, title: a.title, description: a.description, photo: "", video: "" },
        });
      }
    } else if (q.type === "list" && q.listItems) {
      for (const item of q.listItems) {
        await prisma.listAnswer.create({
          data: { quizId: quiz.id, title: item.title, description: item.description, photo: "", video: "" },
        });
      }
    } else if (q.type === "vs" && q.wyrPairs) {
      for (const pair of q.wyrPairs) {
        await prisma.wouldYouRatherAnswer.create({
          data: { quizId: quiz.id, title: pair.a, description: "", photo: "" },
        });
        await prisma.wouldYouRatherAnswer.create({
          data: { quizId: quiz.id, title: pair.b, description: "", photo: "" },
        });
      }
    }

    console.log(`  Created: ${q.title} (${q.type})`);
  }

  // Also create a "quizu" user if missing
  const user = await prisma.user.findFirst({ where: { username: "quizu" } });
  if (!user) {
    await prisma.user.create({
      data: { username: "quizu", password: "", email: "admin@quizu.com", status: "active", fbid: "", photo: "", zip: "", city: "", state: "", country: "", timestamp: String(Date.now()), description: "Quizu Official", messaging: "", ip: "" },
    });
    console.log("  Created quizu user");
  }

  // Create categories if they don't exist
  const newCats = [
    { title: "Personality", term: "personality" },
    { title: "Entertainment", term: "entertainment" },
    { title: "Lifestyle", term: "lifestyle" },
    { title: "Technology", term: "technology" },
    { title: "Pop Culture", term: "popculture" },
    { title: "Science", term: "science" },
    { title: "History", term: "history" },
    { title: "Music", term: "music" },
    { title: "Movies & TV", term: "movies" },
    { title: "Sports", term: "sports" },
  ];
  for (const cat of newCats) {
    const exists = await prisma.category.findFirst({ where: { term: cat.term } });
    if (!exists) {
      await prisma.category.create({
        data: { title: cat.title, term: cat.term, altterm: cat.term, description: "", photo: "", background: "", banner: "" },
      });
      console.log(`  Created category: ${cat.title}`);
    }
  }

  console.log("\nDone!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
