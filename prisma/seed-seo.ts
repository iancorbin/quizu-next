import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface QuizSeed {
  title: string;
  description: string;
  type: string;
  url: string;
  category: string;
  tags: string;
  questions: { question: string; answers: { answer: string; resultIdx?: number; correct?: string }[] }[];
  results?: { title: string; description: string }[];
  pollAnswers?: { title: string; description: string }[];
}

const quizzes: QuizSeed[] = [
  // ─── HIGH-SEO PERSONALITY QUIZZES ─────────────────
  {
    title: "What Type of Intelligence Do You Have?",
    description: "Howard Gardner identified 8 types of intelligence. Which one is your superpower? Take this quiz to discover your dominant intelligence type.",
    type: "personality", url: "what-type-of-intelligence-do-you-have", category: "personality",
    tags: "intelligence,personality,psychology,brain,education",
    questions: [
      { question: "When learning something new, you prefer to:", answers: [{ answer: "Read about it in depth", resultIdx: 0 }, { answer: "Watch someone demonstrate it", resultIdx: 1 }, { answer: "Discuss it with others", resultIdx: 2 }, { answer: "Try it hands-on immediately", resultIdx: 3 }] },
      { question: "In a group project, you naturally take the role of:", answers: [{ answer: "The researcher who finds all the facts", resultIdx: 0 }, { answer: "The designer who creates visuals", resultIdx: 1 }, { answer: "The presenter who communicates ideas", resultIdx: 2 }, { answer: "The builder who creates the prototype", resultIdx: 3 }] },
      { question: "Your ideal weekend involves:", answers: [{ answer: "Getting lost in a great book or documentary", resultIdx: 0 }, { answer: "Visiting an art gallery or taking photos", resultIdx: 1 }, { answer: "Deep conversations with close friends", resultIdx: 2 }, { answer: "Hiking, sports, or building something", resultIdx: 3 }] },
      { question: "When you're stressed, you:", answers: [{ answer: "Analyze the problem logically", resultIdx: 0 }, { answer: "Doodle, listen to music, or rearrange your space", resultIdx: 1 }, { answer: "Talk it through with someone you trust", resultIdx: 2 }, { answer: "Go for a run or do something physical", resultIdx: 3 }] },
      { question: "Which school subject did you secretly enjoy most?", answers: [{ answer: "Science or Math", resultIdx: 0 }, { answer: "Art or Music", resultIdx: 1 }, { answer: "English or History", resultIdx: 2 }, { answer: "P.E. or Shop class", resultIdx: 3 }] },
      { question: "People come to you when they need:", answers: [{ answer: "A logical solution to a complex problem", resultIdx: 0 }, { answer: "Creative ideas or a fresh perspective", resultIdx: 1 }, { answer: "Emotional support and understanding", resultIdx: 2 }, { answer: "Help moving, fixing, or making something", resultIdx: 3 }] },
    ],
    results: [
      { title: "Logical-Mathematical Intelligence", description: "You think in patterns, numbers, and systems. You excel at problem-solving, reasoning, and seeing connections others miss. Careers like engineering, data science, and strategy are your sweet spot." },
      { title: "Visual-Spatial Intelligence", description: "You think in images and dimensions. You have a gift for design, navigation, and seeing the big picture — literally. Architecture, photography, and UX design are your playground." },
      { title: "Interpersonal Intelligence", description: "You read people like books. Your emotional intelligence is off the charts, and you thrive in collaboration. Leadership, counseling, and teaching are where you shine." },
      { title: "Bodily-Kinesthetic Intelligence", description: "You learn through movement and touch. You have exceptional body awareness and coordination. Athletics, surgery, craftsmanship, and performance arts are your domain." },
    ],
  },
  {
    title: "What's Your Love Language?",
    description: "Understanding how you give and receive love can transform your relationships. Discover your primary love language with this personality quiz.",
    type: "personality", url: "whats-your-love-language", category: "personality",
    tags: "love language,relationships,personality,dating,psychology",
    questions: [
      { question: "What makes you feel most appreciated?", answers: [{ answer: "When someone tells me they're proud of me", resultIdx: 0 }, { answer: "When someone gives me a thoughtful gift", resultIdx: 1 }, { answer: "When someone spends quality time with me", resultIdx: 2 }, { answer: "When someone gives me a hug or holds my hand", resultIdx: 3 }] },
      { question: "On a perfect date, you'd want to:", answers: [{ answer: "Have deep, meaningful conversation all evening", resultIdx: 0 }, { answer: "Exchange surprise gifts you picked for each other", resultIdx: 1 }, { answer: "Do an activity together with no phones allowed", resultIdx: 2 }, { answer: "Cook together, dance, or just be physically close", resultIdx: 3 }] },
      { question: "After a hard day, what helps most?", answers: [{ answer: "Hearing \"I'm so proud of how you handled that\"", resultIdx: 0 }, { answer: "Finding a surprise treat or note waiting for me", resultIdx: 1 }, { answer: "Someone dropping everything to be with me", resultIdx: 2 }, { answer: "A long hug or back rub", resultIdx: 3 }] },
      { question: "What hurts you most in a relationship?", answers: [{ answer: "Harsh criticism or lack of encouragement", resultIdx: 0 }, { answer: "Forgotten birthdays or special occasions", resultIdx: 1 }, { answer: "Partner always being too busy for me", resultIdx: 2 }, { answer: "Physical distance or lack of affection", resultIdx: 3 }] },
      { question: "How do you show someone you care?", answers: [{ answer: "I tell them specifically what I admire about them", resultIdx: 0 }, { answer: "I find the perfect gift that shows I was thinking of them", resultIdx: 1 }, { answer: "I clear my schedule to give them my full attention", resultIdx: 2 }, { answer: "I'm physically affectionate — hugs, hand-holding, closeness", resultIdx: 3 }] },
    ],
    results: [
      { title: "Words of Affirmation", description: "You thrive on verbal encouragement, compliments, and hearing \"I love you.\" Words carry enormous weight for you — both positive and negative. A heartfelt note can make your entire week." },
      { title: "Receiving Gifts", description: "It's not about materialism — it's about thoughtfulness. A gift tells you someone was thinking about you when you weren't around. The perfect small gesture means more than any grand display." },
      { title: "Quality Time", description: "Undivided attention is your currency of love. You feel most connected when someone is fully present — phones away, eyes on you, actively listening. It's not about quantity, it's about presence." },
      { title: "Physical Touch", description: "Physical closeness is how you connect most deeply. A hand on your shoulder, a spontaneous hug, or sitting close together speaks volumes. You feel love through physical presence and warmth." },
    ],
  },
  {
    title: "Which Career Path Actually Fits Your Personality?",
    description: "Forget what you studied — what career truly matches who you are? Based on MBTI-inspired traits, discover the career you were actually meant for.",
    type: "personality", url: "which-career-path-fits-your-personality", category: "personality",
    tags: "career,personality,job,mbti,work,professional",
    questions: [
      { question: "At a party, you're usually:", answers: [{ answer: "Working the room and meeting new people", resultIdx: 0 }, { answer: "Having a deep 1-on-1 conversation in the corner", resultIdx: 1 }, { answer: "Organizing the music, food, or activities", resultIdx: 2 }, { answer: "Observing everything and people-watching", resultIdx: 3 }] },
      { question: "When making a big decision, you:", answers: [{ answer: "Go with your gut feeling", resultIdx: 0 }, { answer: "Research extensively before deciding", resultIdx: 1 }, { answer: "Make a pros/cons list and timeline", resultIdx: 2 }, { answer: "Consider how it affects everyone involved", resultIdx: 3 }] },
      { question: "Your desk/workspace is:", answers: [{ answer: "Covered in sticky notes and half-finished projects", resultIdx: 0 }, { answer: "Minimal with a few meaningful items", resultIdx: 1 }, { answer: "Meticulously organized with everything labeled", resultIdx: 2 }, { answer: "Cozy and personalized with photos and plants", resultIdx: 3 }] },
      { question: "Your biggest professional strength is:", answers: [{ answer: "Generating ideas and inspiring others", resultIdx: 0 }, { answer: "Deep focus and analytical thinking", resultIdx: 1 }, { answer: "Planning, execution, and hitting deadlines", resultIdx: 2 }, { answer: "Building relationships and resolving conflicts", resultIdx: 3 }] },
      { question: "On a free afternoon, you'd rather:", answers: [{ answer: "Start a new project or side hustle", resultIdx: 0 }, { answer: "Learn something new online or read", resultIdx: 1 }, { answer: "Organize your home or plan next week", resultIdx: 2 }, { answer: "Volunteer or help a friend with something", resultIdx: 3 }] },
    ],
    results: [
      { title: "The Innovator — Entrepreneurship & Creative Leadership", description: "You're wired to create, disrupt, and lead. You get bored with routine and thrive in dynamic environments. Startups, creative direction, product design, or consulting are your calling." },
      { title: "The Analyst — Research & Strategy", description: "You love going deep. Your superpower is seeing patterns and solving complex puzzles. Data science, research, engineering, or academic careers will light you up." },
      { title: "The Architect — Operations & Management", description: "You're the one who makes things actually happen. Systems, processes, and efficiency are your love language. Project management, operations, finance, or logistics are your zone." },
      { title: "The Connector — People & Impact", description: "You're driven by human connection and making a difference. Teaching, healthcare, HR, social work, or nonprofit leadership are where you'll find deep fulfillment." },
    ],
  },
  {
    title: "What Hogwarts House Do You Actually Belong In?",
    description: "Forget the Sorting Hat — this quiz goes deeper. Answer honestly and discover which Hogwarts house truly matches your values, not just your surface traits.",
    type: "personality", url: "what-hogwarts-house-do-you-belong-in", category: "entertainment",
    tags: "harry potter,hogwarts,personality,sorting hat,gryffindor,slytherin,ravenclaw,hufflepuff",
    questions: [
      { question: "You find a wallet with $500 and an ID. You:", answers: [{ answer: "Track down the owner immediately — it's the right thing", resultIdx: 0 }, { answer: "Turn it in to the police and let them handle it", resultIdx: 1 }, { answer: "Research the most efficient way to return it", resultIdx: 2 }, { answer: "Consider the situation carefully before deciding", resultIdx: 3 }] },
      { question: "A friend is being bullied. You:", answers: [{ answer: "Step in immediately, consequences be damned", resultIdx: 0 }, { answer: "Support your friend privately and report the bully", resultIdx: 1 }, { answer: "Devise a clever plan to expose the bully", resultIdx: 2 }, { answer: "Use the situation to your advantage and protect your friend", resultIdx: 3 }] },
      { question: "What motivates you most?", answers: [{ answer: "Doing what's right, even when it's hard", resultIdx: 0 }, { answer: "Being loyal and making others feel valued", resultIdx: 1 }, { answer: "Learning, understanding, and solving mysteries", resultIdx: 2 }, { answer: "Achieving my goals and proving myself", resultIdx: 3 }] },
      { question: "Your greatest fear is:", answers: [{ answer: "Being a coward when it matters most", resultIdx: 0 }, { answer: "Being excluded or losing your closest friends", resultIdx: 1 }, { answer: "Living in ignorance or being wrong", resultIdx: 2 }, { answer: "Being ordinary or powerless", resultIdx: 3 }] },
      { question: "Pick a superpower:", answers: [{ answer: "Invincibility — nothing can stop me", resultIdx: 0 }, { answer: "Healing — I'd fix everyone's pain", resultIdx: 1 }, { answer: "Omniscience — knowing everything", resultIdx: 2 }, { answer: "Mind control — ultimate influence", resultIdx: 3 }] },
      { question: "Your friends would describe you as:", answers: [{ answer: "Brave, sometimes reckless, always passionate", resultIdx: 0 }, { answer: "Kind, loyal, and the glue that holds everyone together", resultIdx: 1 }, { answer: "Smart, curious, and sometimes in your own world", resultIdx: 2 }, { answer: "Ambitious, resourceful, and determined", resultIdx: 3 }] },
    ],
    results: [
      { title: "Gryffindor 🦁", description: "Courage runs in your veins. You're the person who speaks up when everyone else stays silent. Your bravery isn't about being fearless — it's about acting despite the fear. You'd rather fail spectacularly than never try at all." },
      { title: "Hufflepuff 🦡", description: "Don't mistake kindness for weakness. You're the most underestimated force in any room. Your loyalty is unshakeable, your work ethic is relentless, and you make everyone around you better. Hufflepuffs win in the end — always." },
      { title: "Ravenclaw 🦅", description: "Your mind is your greatest weapon. You see the world as an endless puzzle to solve, and you won't rest until you understand it. Creativity and intellect are your twin superpowers. You're the one who finds the answer no one else can." },
      { title: "Slytherin 🐍", description: "Ambition isn't a dirty word — it's your fuel. You know what you want and you have the cunning to get it. Your resourcefulness in tough situations is legendary. You're the chess player in a room full of checkers players." },
    ],
  },
  {
    title: "How Emotionally Intelligent Are You?",
    description: "Emotional intelligence predicts success better than IQ. Take this science-backed quiz to find out your EQ score and what it means for your life.",
    type: "personality", url: "how-emotionally-intelligent-are-you", category: "personality",
    tags: "emotional intelligence,eq,psychology,self awareness,personality",
    questions: [
      { question: "A coworker snaps at you in a meeting. You:", answers: [{ answer: "Snap back — I won't be disrespected", resultIdx: 0 }, { answer: "Stay quiet but seethe internally", resultIdx: 1 }, { answer: "Consider they might be having a bad day and check in later", resultIdx: 3 }, { answer: "Address it calmly and directly after the meeting", resultIdx: 2 }] },
      { question: "You receive harsh but valid criticism. Your first reaction:", answers: [{ answer: "Defensive — who are they to judge me?", resultIdx: 0 }, { answer: "Hurt — I take it very personally", resultIdx: 1 }, { answer: "Grateful — feedback helps me grow", resultIdx: 3 }, { answer: "Analytical — separate the useful parts from the noise", resultIdx: 2 }] },
      { question: "When someone is crying, you:", answers: [{ answer: "Feel uncomfortable and try to fix the problem", resultIdx: 0 }, { answer: "Get emotional yourself and cry with them", resultIdx: 1 }, { answer: "Listen without judgment and let them feel heard", resultIdx: 3 }, { answer: "Ask thoughtful questions to help them process", resultIdx: 2 }] },
      { question: "You're in an argument with your partner. You:", answers: [{ answer: "Need to win — being right matters", resultIdx: 0 }, { answer: "Shut down and withdraw", resultIdx: 1 }, { answer: "Seek to understand their perspective first", resultIdx: 3 }, { answer: "Suggest a cool-down period then revisit", resultIdx: 2 }] },
      { question: "How well do you know your own emotional triggers?", answers: [{ answer: "I react first, think later", resultIdx: 0 }, { answer: "I know them but struggle to manage them", resultIdx: 1 }, { answer: "I can name them and have strategies for each", resultIdx: 3 }, { answer: "I'm good at recognizing them in the moment", resultIdx: 2 }] },
    ],
    results: [
      { title: "Developing EQ — Score: 40%", description: "You're reactive more than responsive. The good news? EQ is a skill, not a trait — it can be developed. Start by pausing before reacting and asking \"what am I feeling right now?\" That single habit will transform your relationships." },
      { title: "Moderate EQ — Score: 60%", description: "You feel deeply but sometimes struggle to channel it productively. You're empathetic but may absorb others' emotions. Focus on setting boundaries while maintaining your natural sensitivity — it's a superpower when managed well." },
      { title: "High EQ — Score: 80%", description: "You have strong self-awareness and handle conflict with maturity. You balance logic and emotion well. Your next growth edge is helping others develop their emotional intelligence — you're ready to be a mentor." },
      { title: "Exceptional EQ — Score: 95%", description: "You're a master of the emotional landscape. You read rooms instantly, de-escalate conflicts naturally, and make people feel seen. This is the #1 predictor of leadership success. You're exactly who the world needs more of." },
    ],
  },
  // ─── TRIVIA ───────────────────────────────────────
  {
    title: "Can You Pass This Basic Science Quiz That 90% of Adults Fail?",
    description: "These are questions every adult should know. But studies show most people can't answer more than 7 out of 10 correctly. Can you beat the odds?",
    type: "trivia", url: "basic-science-quiz-90-percent-fail", category: "science",
    tags: "science,trivia,general knowledge,education,adults",
    questions: [
      { question: "What gas do plants absorb from the atmosphere?", answers: [{ answer: "Oxygen", correct: "" }, { answer: "Carbon Dioxide", correct: "A" }, { answer: "Nitrogen", correct: "" }, { answer: "Hydrogen", correct: "" }] },
      { question: "How many bones are in the adult human body?", answers: [{ answer: "186", correct: "" }, { answer: "206", correct: "A" }, { answer: "226", correct: "" }, { answer: "196", correct: "" }] },
      { question: "What is the largest organ in the human body?", answers: [{ answer: "Liver", correct: "" }, { answer: "Brain", correct: "" }, { answer: "Skin", correct: "A" }, { answer: "Lungs", correct: "" }] },
      { question: "Light from the Sun takes approximately how long to reach Earth?", answers: [{ answer: "8 seconds", correct: "" }, { answer: "8 minutes", correct: "A" }, { answer: "8 hours", correct: "" }, { answer: "80 minutes", correct: "" }] },
      { question: "What is the chemical formula for table salt?", answers: [{ answer: "NaOH", correct: "" }, { answer: "KCl", correct: "" }, { answer: "NaCl", correct: "A" }, { answer: "CaCl", correct: "" }] },
      { question: "Which planet has the most moons?", answers: [{ answer: "Jupiter", correct: "" }, { answer: "Saturn", correct: "A" }, { answer: "Uranus", correct: "" }, { answer: "Neptune", correct: "" }] },
      { question: "What is the powerhouse of the cell?", answers: [{ answer: "Nucleus", correct: "" }, { answer: "Ribosome", correct: "" }, { answer: "Mitochondria", correct: "A" }, { answer: "Golgi apparatus", correct: "" }] },
      { question: "At what temperature are Celsius and Fahrenheit equal?", answers: [{ answer: "-40°", correct: "A" }, { answer: "0°", correct: "" }, { answer: "-32°", correct: "" }, { answer: "-100°", correct: "" }] },
    ],
    results: [],
  },
  {
    title: "Only 1 in 50 People Can Score 100% on This Geography Quiz",
    description: "Capitals, flags, rivers, and borders. How well do you really know our planet? Most people tap out by question 7.",
    type: "trivia", url: "geography-quiz-1-in-50", category: "science",
    tags: "geography,trivia,world,capitals,countries,education",
    questions: [
      { question: "What is the smallest country in the world by area?", answers: [{ answer: "Monaco", correct: "" }, { answer: "Vatican City", correct: "A" }, { answer: "San Marino", correct: "" }, { answer: "Liechtenstein", correct: "" }] },
      { question: "Which river is the longest in the world?", answers: [{ answer: "Amazon", correct: "" }, { answer: "Nile", correct: "A" }, { answer: "Mississippi", correct: "" }, { answer: "Yangtze", correct: "" }] },
      { question: "What is the capital of Australia?", answers: [{ answer: "Sydney", correct: "" }, { answer: "Melbourne", correct: "" }, { answer: "Canberra", correct: "A" }, { answer: "Brisbane", correct: "" }] },
      { question: "Which country has the most time zones?", answers: [{ answer: "Russia", correct: "" }, { answer: "USA", correct: "" }, { answer: "France", correct: "A" }, { answer: "China", correct: "" }] },
      { question: "What is the largest desert in the world?", answers: [{ answer: "Sahara", correct: "" }, { answer: "Antarctic Desert", correct: "A" }, { answer: "Arabian Desert", correct: "" }, { answer: "Gobi Desert", correct: "" }] },
      { question: "Which African country was formerly known as Abyssinia?", answers: [{ answer: "Somalia", correct: "" }, { answer: "Ethiopia", correct: "A" }, { answer: "Eritrea", correct: "" }, { answer: "Sudan", correct: "" }] },
    ],
    results: [],
  },
  // ─── POLLS ────────────────────────────────────────
  {
    title: "Is Social Media Making Us More or Less Connected?",
    description: "The great debate of our generation. Where do you stand? Cast your vote and see what the world thinks.",
    type: "poll", url: "social-media-more-or-less-connected", category: "technology",
    tags: "social media,technology,debate,society,mental health",
    pollAnswers: [
      { title: "More connected — I've found communities I never would have offline", description: "" },
      { title: "Less connected — we're all just performing, not connecting", description: "" },
      { title: "Both — it depends entirely on how you use it", description: "" },
      { title: "Neither — it's just a different kind of connection", description: "" },
    ],
    questions: [], results: [],
  },
  {
    title: "What's the Most Overrated Travel Destination?",
    description: "Some places look better on Instagram than in real life. Vote for the most overrated destination and see if the internet agrees with you.",
    type: "poll", url: "most-overrated-travel-destination", category: "lifestyle",
    tags: "travel,destinations,overrated,vacation,opinion",
    pollAnswers: [
      { title: "Paris — too crowded, too expensive", description: "" },
      { title: "Dubai — artificial and soulless", description: "" },
      { title: "Times Square, NYC — just billboards and tourists", description: "" },
      { title: "Bali — overrun by influencers", description: "" },
      { title: "Las Vegas — exhausting and wasteful", description: "" },
    ],
    questions: [], results: [],
  },
  // ─── MORE PERSONALITY ─────────────────────────────
  {
    title: "What Era of Music Defines Your Soul?",
    description: "From jazz to hip-hop, punk to K-pop — your music taste reveals more about you than you think. Find your sonic soulmate era.",
    type: "personality", url: "what-era-of-music-defines-your-soul", category: "music",
    tags: "music,personality,era,genres,soul,playlist",
    questions: [
      { question: "Pick a vibe for a road trip playlist:", answers: [{ answer: "Motown and soul classics", resultIdx: 0 }, { answer: "80s synth-pop and new wave", resultIdx: 1 }, { answer: "90s hip-hop and R&B", resultIdx: 2 }, { answer: "2020s indie and bedroom pop", resultIdx: 3 }] },
      { question: "Your ideal concert venue is:", answers: [{ answer: "A smoky jazz club", resultIdx: 0 }, { answer: "A massive arena with laser lights", resultIdx: 1 }, { answer: "An outdoor festival in a field", resultIdx: 2 }, { answer: "An intimate warehouse show", resultIdx: 3 }] },
      { question: "Music is best when it makes you:", answers: [{ answer: "Feel deep emotion and nostalgia", resultIdx: 0 }, { answer: "Want to dance and forget everything", resultIdx: 1 }, { answer: "Think about the world differently", resultIdx: 2 }, { answer: "Feel understood and less alone", resultIdx: 3 }] },
      { question: "Pick an instrument:", answers: [{ answer: "Piano or saxophone", resultIdx: 0 }, { answer: "Synthesizer or electric guitar", resultIdx: 1 }, { answer: "Turntables or drum machine", resultIdx: 2 }, { answer: "Acoustic guitar or ukulele", resultIdx: 3 }] },
      { question: "Your friends say your music taste is:", answers: [{ answer: "Classic and timeless", resultIdx: 0 }, { answer: "Bold and iconic", resultIdx: 1 }, { answer: "Cool and influential", resultIdx: 2 }, { answer: "Chill and ahead of its time", resultIdx: 3 }] },
    ],
    results: [
      { title: "The Golden Era — 60s/70s Soul & Jazz", description: "Your soul vibrates on vinyl frequencies. You crave authenticity, depth, and the raw emotion that only live instruments can deliver. Aretha, Coltrane, and Marvin Gaye are your spiritual guides." },
      { title: "The Neon Era — 80s Synth & Pop", description: "You live for spectacle, energy, and unapologetic fun. You believe music should make you FEEL something big. Madonna, Prince, and Depeche Mode are in your DNA." },
      { title: "The Culture Era — 90s Hip-Hop & R&B", description: "You appreciate craft, storytelling, and cultural impact. Music isn't just entertainment to you — it's expression, identity, and revolution. Nas, Lauryn Hill, and D'Angelo speak your language." },
      { title: "The Now Era — 2020s Indie & Alternative", description: "You're a sonic explorer. You find gems before they blow up and curate playlists like art. You value authenticity over production value. Phoebe Bridgers, Steve Lacy, and Clairo are your world." },
    ],
  },
  {
    title: "What Type of Friend Are You?",
    description: "Every friend group has roles. Are you the planner, the therapist, the wild card, or the rock? Find out which friend archetype you are.",
    type: "personality", url: "what-type-of-friend-are-you", category: "personality",
    tags: "friendship,personality,friend group,relationships,social",
    questions: [
      { question: "The group chat is planning a trip. You're the one who:", answers: [{ answer: "Creates the spreadsheet with dates, costs, and logistics", resultIdx: 0 }, { answer: "Sends 47 memes about the trip before anyone books anything", resultIdx: 1 }, { answer: "Privately checks in to make sure everyone can actually afford it", resultIdx: 2 }, { answer: "Finds the wildest Airbnb and books it impulsively", resultIdx: 3 }] },
      { question: "A friend texts \"can we talk?\" You:", answers: [{ answer: "Clear your calendar and prepare talking points", resultIdx: 0 }, { answer: "Send a meme to lighten the mood first, then call", resultIdx: 1 }, { answer: "Drop everything and call immediately", resultIdx: 2 }, { answer: "Show up at their door with snacks", resultIdx: 3 }] },
      { question: "At a party, you're usually:", answers: [{ answer: "Making sure everyone has drinks and knows each other", resultIdx: 0 }, { answer: "The center of attention telling stories", resultIdx: 1 }, { answer: "Having a real conversation in a quiet corner", resultIdx: 2 }, { answer: "Starting a spontaneous dance-off or karaoke", resultIdx: 3 }] },
      { question: "Your friendship superpower:", answers: [{ answer: "Remembering every birthday, allergy, and life detail", resultIdx: 0 }, { answer: "Making literally anyone laugh, even in dark times", resultIdx: 1 }, { answer: "Knowing exactly when someone needs to talk", resultIdx: 2 }, { answer: "Turning any boring day into an adventure", resultIdx: 3 }] },
      { question: "If your friend group were a heist crew, you'd be:", answers: [{ answer: "The mastermind with the plan", resultIdx: 0 }, { answer: "The charmer who distracts everyone", resultIdx: 1 }, { answer: "The one who keeps morale up under pressure", resultIdx: 2 }, { answer: "The wild card who improvises when plans fail", resultIdx: 3 }] },
    ],
    results: [
      { title: "The Architect 📋", description: "You're the glue and the blueprint. Without you, your friend group would fall apart — and they know it. You remember everything, plan everything, and make sure no one gets left behind. You're not controlling; you're caring at scale." },
      { title: "The Entertainer 🎭", description: "You're the serotonin dealer of the group. Your energy is contagious and your humor is legendary. You make hard things lighter and boring things fun. People don't just like being around you — they need it." },
      { title: "The Empath 💙", description: "You feel everything — yours and theirs. You're the friend who sends the \"hey, you seemed off today\" text that saves someone's week. Your emotional radar is unmatched. You make people feel truly seen." },
      { title: "The Adventurer 🚀", description: "You're the reason your friends have stories to tell. You turn every Tuesday into a potential core memory. Your spontaneity is a gift — you remind everyone that life is meant to be lived, not just planned." },
    ],
  },
];

async function main() {
  console.log(`Seeding ${quizzes.length} SEO-optimized quizzes...`);

  for (const q of quizzes) {
    const existing = await prisma.quizMeta.findFirst({ where: { url: q.url } });
    if (existing) { console.log(`  Skip: ${q.title}`); continue; }

    const quiz = await prisma.quizMeta.create({
      data: {
        title: q.title, description: q.description, type: q.type, url: q.url,
        category: q.category, tags: q.tags, published: "2",
        timestamp: String(Math.floor(Date.now() / 1000)), username: "quizu",
        views: String(Math.floor(Math.random() * 5000) + 500),
        taken: String(Math.floor(Math.random() * 3000) + 200),
        loves: "0", rating: "", photo: "", photoBig: "",
        tagsEditorial: "", tagsUser: "", theme: "", ip: "",
      },
    });

    if ((q.type === "personality" || q.type === "personalityalt") && q.results) {
      const resultIds: number[] = [];
      for (const r of q.results) {
        const res = await prisma.quizPersonalityResult.create({
          data: { quizId: quiz.id, title: r.title, description: r.description, photo: "" },
        });
        resultIds.push(res.id);
      }
      for (const qn of q.questions) {
        const question = await prisma.quizPersonalityQuestion.create({
          data: { quizId: quiz.id, question: qn.question, photo: "", video: "", username: "quizu" },
        });
        for (const a of qn.answers) {
          await prisma.quizPersonalityAnswer.create({
            data: {
              quizId: quiz.id, questionId: question.id,
              resultId: resultIds[a.resultIdx ?? 0] || resultIds[0],
              answer: a.answer, photo: "", video: "", correct: "",
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
            data: { quizId: quiz.id, questionId: question.id, answer: a.answer, correct: a.correct || "", photo: "" },
          });
        }
      }
    } else if (q.type === "poll" && q.pollAnswers) {
      for (const a of q.pollAnswers) {
        await prisma.pollAnswer.create({
          data: { quizId: quiz.id, title: a.title, description: a.description, photo: "", video: "" },
        });
      }
    }

    console.log(`  ✓ ${q.title}`);
  }

  console.log("\nDone!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
