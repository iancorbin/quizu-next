import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface TriviaQuiz {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  questions: { q: string; answers: string[]; correct: number }[]; // correct = index of right answer
}

const quizzes: TriviaQuiz[] = [
  // ─── MOVIES & TV ──────────────────────────────────
  { title: "Can You Name These 90s Movies From a Single Screenshot?", description: "Only true 90s kids will score above 80%. Test your movie knowledge.", url: "name-90s-movies-from-screenshot", category: "movies", tags: "90s,movies,nostalgia,film",
    questions: [
      { q: "Which 1994 film features a box of chocolates as a life metaphor?", answers: ["The Shawshank Redemption", "Forrest Gump", "Pulp Fiction", "The Lion King"], correct: 1 },
      { q: "What 1999 movie popularized the phrase 'I see dead people'?", answers: ["The Blair Witch Project", "The Matrix", "The Sixth Sense", "Fight Club"], correct: 2 },
      { q: "Which 90s film features a ship sinking on its maiden voyage?", answers: ["The Perfect Storm", "Titanic", "Waterworld", "Deep Blue Sea"], correct: 1 },
      { q: "What 1993 Steven Spielberg film brought dinosaurs to life?", answers: ["Jurassic Park", "Jaws", "E.T.", "Indiana Jones"], correct: 0 },
      { q: "Which 1995 Pixar film was the first fully computer-animated feature?", answers: ["A Bug's Life", "Finding Nemo", "Toy Story", "Monsters Inc"], correct: 2 },
    ] },
  { title: "Only a TV Superfan Can Score 10/10 on This Sitcom Quiz", description: "From Friends to The Office to Seinfeld — how well do you know the greatest sitcoms ever made?", url: "tv-sitcom-quiz-10-out-of-10", category: "entertainment", tags: "tv,sitcom,friends,office,comedy",
    questions: [
      { q: "In Friends, what is the name of Ross's monkey?", answers: ["George", "Marcel", "Clyde", "Bubbles"], correct: 1 },
      { q: "What is the name of the paper company in The Office?", answers: ["Dunder Mifflin", "Sterling Cooper", "Wernham Hogg", "Prestige Worldwide"], correct: 0 },
      { q: "In Seinfeld, what is Kramer's first name?", answers: ["Cosmo", "Kenneth", "Harold", "Walter"], correct: 0 },
      { q: "Which sitcom takes place in a bar called Paddy's Pub?", answers: ["How I Met Your Mother", "Cheers", "It's Always Sunny in Philadelphia", "New Girl"], correct: 2 },
      { q: "In Brooklyn Nine-Nine, what is Jake Peralta's favorite movie?", answers: ["Lethal Weapon", "Die Hard", "Speed", "Point Break"], correct: 1 },
      { q: "What is the name of the coffee shop in Friends?", answers: ["The Coffee Bean", "Central Perk", "The Grind", "Java the Hutt"], correct: 1 },
    ] },
  // ─── SCIENCE ──────────────────────────────────────
  { title: "This Science Quiz Is So Hard Only PhDs Get 100%", description: "Advanced science questions that will test the limits of your knowledge. Average score: 4/10.", url: "science-quiz-only-phds-pass", category: "science", tags: "science,hard,physics,chemistry,biology",
    questions: [
      { q: "What is the most abundant element in the universe?", answers: ["Oxygen", "Carbon", "Helium", "Hydrogen"], correct: 3 },
      { q: "What is the speed of light in a vacuum (approximately)?", answers: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correct: 0 },
      { q: "Which organ produces insulin?", answers: ["Liver", "Pancreas", "Kidney", "Stomach"], correct: 1 },
      { q: "What is the hardest natural substance on Earth?", answers: ["Titanium", "Graphene", "Diamond", "Tungsten"], correct: 2 },
      { q: "How many chromosomes do humans have?", answers: ["23", "46", "44", "48"], correct: 1 },
      { q: "What is the chemical symbol for gold?", answers: ["Go", "Gd", "Au", "Ag"], correct: 2 },
      { q: "Which planet has the strongest gravity in our solar system?", answers: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1 },
    ] },
  { title: "Can You Pass 8th Grade Science?", description: "Questions straight from a middle school science textbook. You'd be surprised how many adults can't pass this.", url: "can-you-pass-8th-grade-science", category: "science", tags: "science,education,school,easy",
    questions: [
      { q: "What are the three states of matter?", answers: ["Solid, Liquid, Gas", "Solid, Liquid, Plasma", "Earth, Water, Fire", "Proton, Neutron, Electron"], correct: 0 },
      { q: "What is the process by which plants make food?", answers: ["Respiration", "Fermentation", "Photosynthesis", "Osmosis"], correct: 2 },
      { q: "What is the center of an atom called?", answers: ["Electron cloud", "Shell", "Nucleus", "Core"], correct: 2 },
      { q: "Which force keeps us on the ground?", answers: ["Magnetism", "Friction", "Gravity", "Inertia"], correct: 2 },
      { q: "What is the boiling point of water in Celsius?", answers: ["90°C", "100°C", "110°C", "212°C"], correct: 1 },
    ] },
  // ─── HISTORY ──────────────────────────────────────
  { title: "Are You Smarter Than a History Professor?", description: "From ancient Rome to modern politics — only history buffs score above 70%.", url: "smarter-than-history-professor", category: "history", tags: "history,world,war,ancient,knowledge",
    questions: [
      { q: "In what year did World War II end?", answers: ["1943", "1944", "1945", "1946"], correct: 2 },
      { q: "Who was the first President of the United States?", answers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin", "George Washington"], correct: 3 },
      { q: "The Great Wall of China was primarily built to protect against invasions from:", answers: ["Japan", "Mongolia", "Russia", "India"], correct: 1 },
      { q: "Which ancient civilization built the pyramids at Giza?", answers: ["Roman", "Greek", "Egyptian", "Mesopotamian"], correct: 2 },
      { q: "The Berlin Wall fell in what year?", answers: ["1987", "1989", "1991", "1993"], correct: 1 },
      { q: "Who wrote the 'I Have a Dream' speech?", answers: ["Malcolm X", "Martin Luther King Jr.", "Rosa Parks", "Frederick Douglass"], correct: 1 },
    ] },
  // ─── FOOD ─────────────────────────────────────────
  { title: "Only a True Foodie Can Score 100% on This Quiz", description: "Sushi, pasta, spices, and everything in between. How well do you really know food?", url: "true-foodie-quiz-100-percent", category: "lifestyle", tags: "food,cooking,cuisine,foodie",
    questions: [
      { q: "What country is the origin of sushi?", answers: ["China", "Korea", "Japan", "Thailand"], correct: 2 },
      { q: "What is the main ingredient in guacamole?", answers: ["Tomato", "Avocado", "Lime", "Cilantro"], correct: 1 },
      { q: "Saffron comes from which flower?", answers: ["Rose", "Sunflower", "Crocus", "Lavender"], correct: 2 },
      { q: "What type of pasta is shaped like small rice grains?", answers: ["Penne", "Orzo", "Rigatoni", "Fusilli"], correct: 1 },
      { q: "Which country consumes the most coffee per capita?", answers: ["Brazil", "USA", "Italy", "Finland"], correct: 3 },
    ] },
  // ─── MUSIC ────────────────────────────────────────
  { title: "Can You Identify These Songs From Their First Lyric?", description: "We give you the opening line, you name the song. Only music encyclopedias get all 8 right.", url: "identify-songs-from-first-lyric", category: "music", tags: "music,songs,lyrics,pop,rock",
    questions: [
      { q: "'Is this the real life? Is this just fantasy?'", answers: ["Stairway to Heaven", "Bohemian Rhapsody", "Hotel California", "Imagine"], correct: 1 },
      { q: "'Just a small town girl, living in a lonely world'", answers: ["Don't Stop Believin'", "Livin' on a Prayer", "Born to Run", "Sweet Child O' Mine"], correct: 0 },
      { q: "'Hello, it's me'", answers: ["Hello by Lionel Richie", "Hello by Adele", "Hello Goodbye by Beatles", "Say Hello by Rihanna"], correct: 1 },
      { q: "'We're no strangers to love'", answers: ["I Want to Know What Love Is", "Never Gonna Give You Up", "What Is Love", "Crazy in Love"], correct: 1 },
      { q: "'I got my mind set on you'", answers: ["George Harrison", "Elton John", "Billy Joel", "Phil Collins"], correct: 0 },
    ] },
  // ─── GEOGRAPHY ────────────────────────────────────
  { title: "Can You Name Every Country in Europe?", description: "There are 44 countries in Europe. Most people can only name 20. How many do you actually know?", url: "name-every-country-in-europe", category: "science", tags: "geography,europe,countries,world",
    questions: [
      { q: "Which European country has the largest population?", answers: ["Germany", "France", "Russia", "United Kingdom"], correct: 2 },
      { q: "What is the smallest country in Europe?", answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correct: 1 },
      { q: "Which country is known as the 'Land of Fire and Ice'?", answers: ["Norway", "Finland", "Iceland", "Greenland"], correct: 2 },
      { q: "The Danube River flows through how many European countries?", answers: ["5", "8", "10", "12"], correct: 2 },
      { q: "Which European country has the most UNESCO World Heritage Sites?", answers: ["France", "Italy", "Spain", "Germany"], correct: 1 },
      { q: "What is the capital of Switzerland?", answers: ["Zurich", "Geneva", "Bern", "Basel"], correct: 2 },
    ] },
  // ─── SPORTS ───────────────────────────────────────
  { title: "The Ultimate Sports Trivia Challenge", description: "From the NBA to the World Cup — test your knowledge across every major sport.", url: "ultimate-sports-trivia-challenge", category: "sports", tags: "sports,nba,football,soccer,olympics",
    questions: [
      { q: "How many players are on a basketball team on the court?", answers: ["4", "5", "6", "7"], correct: 1 },
      { q: "Which country has won the most FIFA World Cups?", answers: ["Germany", "Argentina", "Italy", "Brazil"], correct: 3 },
      { q: "In tennis, what is a score of 40-40 called?", answers: ["Match point", "Break point", "Deuce", "Advantage"], correct: 2 },
      { q: "How many rings are on the Olympic flag?", answers: ["4", "5", "6", "7"], correct: 1 },
      { q: "Which sport uses a shuttlecock?", answers: ["Tennis", "Badminton", "Squash", "Table Tennis"], correct: 1 },
    ] },
  // ─── POP CULTURE ──────────────────────────────────
  { title: "How Well Do You Know the Marvel Cinematic Universe?", description: "From Iron Man to Endgame — only true fans can answer all 8 questions correctly.", url: "how-well-do-you-know-mcu", category: "entertainment", tags: "marvel,mcu,avengers,movies,superheroes",
    questions: [
      { q: "What is the first MCU film?", answers: ["The Avengers", "Captain America", "Iron Man", "Thor"], correct: 2 },
      { q: "What is the name of Thor's hammer?", answers: ["Stormbreaker", "Gungnir", "Mjolnir", "Hofund"], correct: 2 },
      { q: "Which Infinity Stone is hidden on Vormir?", answers: ["Time Stone", "Soul Stone", "Power Stone", "Mind Stone"], correct: 1 },
      { q: "What is Black Panther's real name?", answers: ["T'Chaka", "T'Challa", "M'Baku", "N'Jadaka"], correct: 1 },
      { q: "Who snaps the Infinity Gauntlet to defeat Thanos in Endgame?", answers: ["Thor", "Captain America", "Iron Man", "Hulk"], correct: 2 },
      { q: "What is Captain America's shield made of?", answers: ["Adamantium", "Uru", "Vibranium", "Titanium"], correct: 2 },
    ] },
  { title: "Can You Match the Disney Movie to Its Villain?", description: "Everyone knows the heroes. But only Disney experts know ALL the villains.", url: "match-disney-movie-to-villain", category: "entertainment", tags: "disney,villains,movies,animation",
    questions: [
      { q: "Who is the villain in The Little Mermaid?", answers: ["Maleficent", "Ursula", "Cruella", "Mother Gothel"], correct: 1 },
      { q: "Scar is the villain in which Disney film?", answers: ["Aladdin", "Mulan", "The Lion King", "Tarzan"], correct: 2 },
      { q: "Who is the villain in 101 Dalmatians?", answers: ["Lady Tremaine", "Cruella de Vil", "Queen of Hearts", "Yzma"], correct: 1 },
      { q: "Gaston is the villain in which film?", answers: ["Cinderella", "Tangled", "Beauty and the Beast", "Brave"], correct: 2 },
      { q: "Who is the villain in Sleeping Beauty?", answers: ["Ursula", "Evil Queen", "Maleficent", "Jafar"], correct: 2 },
    ] },
  // ─── TECH ─────────────────────────────────────────
  { title: "Are You a True Tech Nerd? Prove It.", description: "From coding to hardware to internet history — this quiz separates the casuals from the experts.", url: "are-you-a-true-tech-nerd", category: "technology", tags: "technology,coding,computers,internet,nerd",
    questions: [
      { q: "What does HTML stand for?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
      { q: "Who is considered the father of the World Wide Web?", answers: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Vint Cerf"], correct: 2 },
      { q: "What year was the iPhone first released?", answers: ["2005", "2006", "2007", "2008"], correct: 2 },
      { q: "What does 'GPU' stand for?", answers: ["General Processing Unit", "Graphics Processing Unit", "Global Power Unit", "Graphical Performance Utility"], correct: 1 },
      { q: "Which programming language was created by Guido van Rossum?", answers: ["Java", "JavaScript", "Ruby", "Python"], correct: 3 },
      { q: "What was Google's original name?", answers: ["PageRank", "BackRub", "Alphabet", "SearchBot"], correct: 1 },
    ] },
  // ─── ANIMALS ──────────────────────────────────────
  { title: "Can You Score 100% on This Animal Quiz?", description: "From the deep ocean to the savanna — how much do you really know about the animal kingdom?", url: "score-100-animal-quiz", category: "science", tags: "animals,nature,wildlife,biology",
    questions: [
      { q: "What is the fastest land animal?", answers: ["Lion", "Cheetah", "Gazelle", "Horse"], correct: 1 },
      { q: "How many hearts does an octopus have?", answers: ["1", "2", "3", "4"], correct: 2 },
      { q: "What is a group of flamingos called?", answers: ["A flock", "A colony", "A flamboyance", "A parade"], correct: 2 },
      { q: "Which animal has the longest lifespan?", answers: ["Elephant", "Blue whale", "Giant tortoise", "Greenland shark"], correct: 3 },
      { q: "What is the only mammal capable of true flight?", answers: ["Flying squirrel", "Sugar glider", "Bat", "Colugo"], correct: 2 },
    ] },
  // ─── SPACE ────────────────────────────────────────
  { title: "How Much Do You Actually Know About Space?", description: "The universe is mind-blowingly vast. Let's see if your space knowledge measures up.", url: "how-much-do-you-know-about-space", category: "science", tags: "space,astronomy,planets,universe,nasa",
    questions: [
      { q: "How many planets are in our solar system?", answers: ["7", "8", "9", "10"], correct: 1 },
      { q: "What is the largest planet in our solar system?", answers: ["Saturn", "Neptune", "Jupiter", "Uranus"], correct: 2 },
      { q: "What is a light-year a measure of?", answers: ["Time", "Speed", "Distance", "Brightness"], correct: 2 },
      { q: "Which planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1 },
      { q: "What was the first animal sent into space?", answers: ["Dog", "Monkey", "Fruit flies", "Cat"], correct: 2 },
      { q: "How old is the universe approximately?", answers: ["4.5 billion years", "10 billion years", "13.8 billion years", "20 billion years"], correct: 2 },
    ] },
  // ─── LANGUAGE ─────────────────────────────────────
  { title: "Can You Guess the Language From a Single Word?", description: "We show you one word — you tell us the language. Polyglots only.", url: "guess-language-from-single-word", category: "entertainment", tags: "language,words,polyglot,world",
    questions: [
      { q: "What language is 'Danke'?", answers: ["Dutch", "German", "Swedish", "Norwegian"], correct: 1 },
      { q: "What language is 'Gracias'?", answers: ["Italian", "Portuguese", "Spanish", "French"], correct: 2 },
      { q: "What language is 'Arigatou'?", answers: ["Korean", "Chinese", "Thai", "Japanese"], correct: 3 },
      { q: "What language is 'Merci'?", answers: ["French", "Italian", "Romanian", "Catalan"], correct: 0 },
      { q: "What language is 'Spasibo'?", answers: ["Polish", "Czech", "Russian", "Ukrainian"], correct: 2 },
    ] },
  // ─── INTERNET ─────────────────────────────────────
  { title: "Only Millennials Can Pass This Internet History Quiz", description: "AIM, MySpace, Neopets, and Limewire. Do you remember the early internet?", url: "millennials-internet-history-quiz", category: "technology", tags: "internet,millennial,nostalgia,90s,2000s",
    questions: [
      { q: "What social network let you customize your profile with HTML?", answers: ["Facebook", "Friendster", "MySpace", "Hi5"], correct: 2 },
      { q: "What messaging app used buddy lists and away messages?", answers: ["ICQ", "AIM", "MSN Messenger", "Yahoo Messenger"], correct: 1 },
      { q: "What year did Facebook launch?", answers: ["2002", "2004", "2006", "2008"], correct: 1 },
      { q: "What was the name of the dancing baby meme from 1996?", answers: ["Baby Cha Cha", "Dancing Dan", "Groove Baby", "Funky Infant"], correct: 0 },
      { q: "Which search engine was the most popular before Google?", answers: ["Bing", "AltaVista", "Yahoo", "Ask Jeeves"], correct: 2 },
    ] },
];

async function main() {
  console.log(`Seeding ${quizzes.length} trivia quizzes...`);

  for (const q of quizzes) {
    const existing = await prisma.quizMeta.findFirst({ where: { url: q.url } });
    if (existing) { console.log(`  Skip: ${q.title}`); continue; }

    const quiz = await prisma.quizMeta.create({
      data: {
        title: q.title, description: q.description, type: "trivia", url: q.url,
        category: q.category, tags: q.tags, published: "2",
        timestamp: String(Math.floor(Date.now() / 1000)), username: "quizu",
        views: String(Math.floor(Math.random() * 8000) + 1000),
        taken: String(Math.floor(Math.random() * 5000) + 500),
        loves: "0", rating: "", photo: "", photoBig: "",
        tagsEditorial: "", tagsUser: "", theme: "", ip: "",
      },
    });

    for (const qn of q.questions) {
      const question = await prisma.quizTriviaQuestion.create({
        data: { quizId: quiz.id, question: qn.q, photo: "" },
      });
      for (let i = 0; i < qn.answers.length; i++) {
        await prisma.quizTriviaAnswer.create({
          data: {
            quizId: quiz.id, questionId: question.id,
            answer: qn.answers[i], correct: i === qn.correct ? "A" : "", photo: "",
          },
        });
      }
    }

    console.log(`  ✓ ${q.title} (${q.questions.length} questions)`);
  }

  console.log("\nDone!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
