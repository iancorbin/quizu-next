import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const quizzes = [
  { title: "Can You Name Every NFL Team?", url: "name-every-nfl-team", category: "sports", tags: "nfl,football,teams,sports", description: "32 teams. How many can you actually name? Most people tap out around 20.",
    questions: [
      { q: "Which NFL team has won the most Super Bowls?", answers: ["Dallas Cowboys", "New England Patriots", "Pittsburgh Steelers", "San Francisco 49ers"], correct: 2 },
      { q: "What city are the Packers from?", answers: ["Milwaukee", "Madison", "Green Bay", "Minneapolis"], correct: 2 },
      { q: "Which team plays at SoFi Stadium?", answers: ["LA Rams", "Las Vegas Raiders", "Arizona Cardinals", "Seattle Seahawks"], correct: 0 },
      { q: "Who holds the NFL record for most career touchdowns?", answers: ["Peyton Manning", "Tom Brady", "Jerry Rice", "Emmitt Smith"], correct: 2 },
      { q: "Which team went 16-0 in the regular season in 2007?", answers: ["Pittsburgh Steelers", "New England Patriots", "Indianapolis Colts", "Green Bay Packers"], correct: 1 },
      { q: "What animal is the mascot for the Cincinnati team?", answers: ["Bear", "Tiger", "Bengal", "Panther"], correct: 2 },
    ] },
  { title: "NBA Legends Quiz: Only Real Fans Score 100%", url: "nba-legends-quiz", category: "sports", tags: "nba,basketball,legends,sports", description: "From Jordan to LeBron — test your knowledge of NBA greatness.",
    questions: [
      { q: "How many NBA championships did Michael Jordan win?", answers: ["4", "5", "6", "7"], correct: 2 },
      { q: "Who holds the record for most points in a single NBA game?", answers: ["Kobe Bryant", "Wilt Chamberlain", "Michael Jordan", "LeBron James"], correct: 1 },
      { q: "Which team drafted Kobe Bryant?", answers: ["LA Lakers", "Charlotte Hornets", "Philadelphia 76ers", "Chicago Bulls"], correct: 1 },
      { q: "Who is the NBA's all-time leading scorer?", answers: ["Kareem Abdul-Jabbar", "Karl Malone", "LeBron James", "Michael Jordan"], correct: 2 },
      { q: "How tall is the standard NBA basketball hoop?", answers: ["9 feet", "10 feet", "11 feet", "12 feet"], correct: 1 },
      { q: "Which player is known as 'The Greek Freak'?", answers: ["Luka Doncic", "Nikola Jokic", "Giannis Antetokounmpo", "Joel Embiid"], correct: 2 },
    ] },
  { title: "World Cup Trivia: The Ultimate Soccer Quiz", url: "world-cup-trivia-soccer", category: "sports", tags: "soccer,football,world cup,fifa,sports", description: "From 1930 to today. How well do you know the beautiful game's biggest stage?",
    questions: [
      { q: "Which country has won the most FIFA World Cups?", answers: ["Germany", "Italy", "Argentina", "Brazil"], correct: 3 },
      { q: "In what year was the first World Cup held?", answers: ["1928", "1930", "1934", "1950"], correct: 1 },
      { q: "Who scored the 'Hand of God' goal?", answers: ["Pelé", "Zinedine Zidane", "Diego Maradona", "Ronaldo"], correct: 2 },
      { q: "Which country hosted the 2022 World Cup?", answers: ["Russia", "Qatar", "UAE", "Saudi Arabia"], correct: 1 },
      { q: "Who is the all-time top scorer in World Cup history?", answers: ["Ronaldo (Brazil)", "Miroslav Klose", "Pelé", "Gerd Müller"], correct: 1 },
      { q: "Which team won the first ever World Cup?", answers: ["Brazil", "Argentina", "Uruguay", "Italy"], correct: 2 },
    ] },
  { title: "Do You Know Your Olympic History?", url: "olympic-history-quiz", category: "sports", tags: "olympics,history,sports,gold medal", description: "From ancient Greece to the modern games. Are you an Olympic scholar?",
    questions: [
      { q: "Where were the first modern Olympic Games held?", answers: ["Paris", "London", "Athens", "Rome"], correct: 2 },
      { q: "Who has won the most Olympic gold medals ever?", answers: ["Usain Bolt", "Michael Phelps", "Carl Lewis", "Larisa Latynina"], correct: 1 },
      { q: "In what year were women first allowed to compete in the Olympics?", answers: ["1896", "1900", "1920", "1948"], correct: 1 },
      { q: "Which city has hosted the most Olympic Games?", answers: ["Paris", "London", "Los Angeles", "Tokyo"], correct: 1 },
      { q: "What do the five Olympic rings represent?", answers: ["Five sports", "Five continents", "Five founding countries", "Five ideals"], correct: 1 },
    ] },
  { title: "Can You Match the Athlete to Their Sport?", url: "match-athlete-to-sport", category: "sports", tags: "athletes,sports,famous,trivia", description: "We give you the name, you pick the sport. Easier said than done.",
    questions: [
      { q: "Simone Biles is famous for which sport?", answers: ["Swimming", "Gymnastics", "Track & Field", "Diving"], correct: 1 },
      { q: "What sport does Naomi Osaka play?", answers: ["Golf", "Badminton", "Tennis", "Volleyball"], correct: 2 },
      { q: "Connor McDavid is a star in which sport?", answers: ["Basketball", "Football", "Ice Hockey", "Soccer"], correct: 2 },
      { q: "What sport is Megan Rapinoe known for?", answers: ["Soccer", "Basketball", "Tennis", "Softball"], correct: 0 },
      { q: "Dustin Johnson is a professional in which sport?", answers: ["Tennis", "Golf", "Baseball", "Racing"], correct: 1 },
      { q: "Katie Ledecky dominates which sport?", answers: ["Gymnastics", "Figure Skating", "Swimming", "Track & Field"], correct: 2 },
    ] },
  // More trivia
  { title: "This US States Quiz Stumps Everyone", url: "us-states-quiz-stumps-everyone", category: "science", tags: "geography,usa,states,capitals", description: "You think you know all 50 states? Most people can't even get 8 of these right.",
    questions: [
      { q: "What is the smallest US state by area?", answers: ["Delaware", "Connecticut", "Rhode Island", "Vermont"], correct: 2 },
      { q: "Which state has the most coastline?", answers: ["California", "Florida", "Alaska", "Hawaii"], correct: 2 },
      { q: "What is the capital of Montana?", answers: ["Billings", "Helena", "Missoula", "Bozeman"], correct: 1 },
      { q: "Which state was the last to join the US?", answers: ["Alaska", "Hawaii", "Arizona", "New Mexico"], correct: 1 },
      { q: "What state is known as the 'Lone Star State'?", answers: ["Arizona", "New Mexico", "Texas", "Montana"], correct: 2 },
      { q: "Which state has the most national parks?", answers: ["Utah", "Colorado", "Alaska", "California"], correct: 3 },
    ] },
  { title: "Only Music Nerds Can Ace This Album Quiz", url: "music-nerds-album-quiz", category: "music", tags: "music,albums,artists,trivia", description: "We name the album, you name the artist. Simple? Not so fast.",
    questions: [
      { q: "Who released the album 'Thriller'?", answers: ["Prince", "Michael Jackson", "Stevie Wonder", "Whitney Houston"], correct: 1 },
      { q: "'Abbey Road' is an album by which band?", answers: ["The Rolling Stones", "Pink Floyd", "The Beatles", "Led Zeppelin"], correct: 2 },
      { q: "Who released '21' in 2011?", answers: ["Taylor Swift", "Beyoncé", "Rihanna", "Adele"], correct: 3 },
      { q: "'The Dark Side of the Moon' was created by?", answers: ["Pink Floyd", "Led Zeppelin", "Black Sabbath", "The Who"], correct: 0 },
      { q: "Who released 'good kid, m.A.A.d city'?", answers: ["Drake", "J. Cole", "Kendrick Lamar", "Kanye West"], correct: 2 },
      { q: "'Rumours' is a classic album by which band?", answers: ["Eagles", "Fleetwood Mac", "ABBA", "Bee Gees"], correct: 1 },
    ] },
];

async function main() {
  console.log(`Seeding ${quizzes.length} quizzes...`);
  for (const q of quizzes) {
    const existing = await prisma.quizMeta.findFirst({ where: { url: q.url } });
    if (existing) { console.log(`  Skip: ${q.title}`); continue; }
    const quiz = await prisma.quizMeta.create({
      data: { title: q.title, description: q.description, type: "trivia", url: q.url, category: q.category, tags: q.tags, published: "2",
        timestamp: String(Math.floor(Date.now() / 1000)), username: "quizu",
        views: String(Math.floor(Math.random() * 8000) + 1000), taken: String(Math.floor(Math.random() * 5000) + 500),
        loves: "0", rating: "", photo: "", photoBig: "", tagsEditorial: "", tagsUser: "", theme: "", ip: "" },
    });
    for (const qn of q.questions) {
      const question = await prisma.quizTriviaQuestion.create({ data: { quizId: quiz.id, question: qn.q, photo: "" } });
      for (let i = 0; i < qn.answers.length; i++) {
        await prisma.quizTriviaAnswer.create({ data: { quizId: quiz.id, questionId: question.id, answer: qn.answers[i], correct: i === qn.correct ? "A" : "", photo: "" } });
      }
    }
    console.log(`  ✓ ${q.title} (${q.questions.length} questions)`);
  }
  console.log("\nDone!");
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
