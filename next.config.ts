import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // These run before file-system routes, so reserved paths are handled first
      beforeFiles: [],
      afterFiles: [
        // Flat quiz URLs: /my-quiz-slug → /quiz/my-quiz-slug
        // Only matches slugs that contain at least one letter and a hyphen (quiz URL pattern)
        {
          source: "/:slug((?!browse|topic|auth|api|_next|favicon|logo|uploads)[a-zA-Z][a-zA-Z0-9-]+(?:-[a-zA-Z0-9-]+)+)",
          destination: "/quiz/:slug",
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
