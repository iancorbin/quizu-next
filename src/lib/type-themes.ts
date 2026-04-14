// Each quiz type has its own visual personality
export const typeThemes = {
  personality: {
    label: "Personality Quizzes",
    tagline: "Who are you, really?",
    description: "Uncover your hidden traits, quirks, and inner identity. These quizzes reveal the you that only your subconscious knows.",
    heroGradient: "linear-gradient(135deg, #FF2D87 0%, #FF6B6B 50%, #FFA07A 100%)",
    accentColor: "var(--neon-pink)",
    accentSoft: "var(--neon-pink-soft)",
    patternOpacity: 0.06,
  },
  trivia: {
    label: "Trivia",
    tagline: "How much do you actually know?",
    description: "Challenge your brain across science, history, pop culture, and more. Fair warning: most people overestimate their knowledge.",
    heroGradient: "linear-gradient(135deg, #00E5FF 0%, #0099CC 50%, #006699 100%)",
    accentColor: "var(--neon-cyan)",
    accentSoft: "var(--neon-cyan-soft)",
    patternOpacity: 0.08,
  },
  poll: {
    label: "Polls",
    tagline: "Where do you stand?",
    description: "Cast your vote on the debates that matter (and the ones that don't). See if the world agrees with you.",
    heroGradient: "linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)",
    accentColor: "#10B981",
    accentSoft: "#E8FFF0",
    patternOpacity: 0.07,
  },
  list: {
    label: "Lists",
    tagline: "Ranked. Rated. Debated.",
    description: "From the essential to the absurd — curated lists that spark conversation.",
    heroGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)",
    accentColor: "#F59E0B",
    accentSoft: "#FFF8E1",
    patternOpacity: 0.06,
  },
  vs: {
    label: "Would You Rather",
    tagline: "No good options. Choose anyway.",
    description: "Impossible dilemmas that reveal more about you than any personality test ever could.",
    heroGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
    accentColor: "#8B5CF6",
    accentSoft: "#F3E8FF",
    patternOpacity: 0.07,
  },
} as const;

export type QuizType = keyof typeof typeThemes;
