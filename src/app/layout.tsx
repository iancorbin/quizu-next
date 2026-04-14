import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Quizu — Personality Quizzes, Trivia, Polls & More",
  description:
    "Take thousands of personality quizzes, trivia tests, polls, and more. Discover yourself with Quizu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col" style={{ fontFamily: "var(--font-body)" }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
