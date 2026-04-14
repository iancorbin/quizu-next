import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { SortableTable } from "@/components/sortable-table";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ type?: string }> }): Promise<Metadata> {
  const { type } = await searchParams;
  const label = type ? type.charAt(0).toUpperCase() + type.slice(1) : "All";
  return { title: `${label} Quizzes — Browse | Quizu`, description: `Browse ${label.toLowerCase()} quizzes on Quizu.` };
}

const TYPES = [
  { value: "", label: "All" }, { value: "personality", label: "Personality" },
  { value: "trivia", label: "Trivia" }, { value: "poll", label: "Polls" },
  { value: "list", label: "Lists" }, { value: "vs", label: "WYR" },
];

export default async function BrowsePage({
  searchParams,
}: { searchParams: Promise<{ type?: string; category?: string; page?: string; view?: string }> }) {
  const { type, category, page: pageStr, view } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const isTable = view === "table";
  const perPage = isTable ? 30 : 24;

  const where: Record<string, unknown> = { published: "2", NOT: { title: "" } };
  if (type) { if (type === "personality") where.type = { in: ["personality", "personalityalt"] }; else where.type = type; }
  if (category) where.category = category;

  const [quizzes, total, categories] = await Promise.all([
    prisma.quizMeta.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.quizMeta.count({ where }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
  ]);

  const liveCats: typeof categories = [];
  for (const c of categories) {
    const n = await prisma.quizMeta.count({ where: { category: c.term, published: "2", NOT: { title: "" } } });
    if (n > 0) liveCats.push(c);
  }

  const totalPages = Math.ceil(total / perPage);

  function buildUrl(p: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const t = p.type !== undefined ? p.type : type; const c = p.category !== undefined ? p.category : category;
    const v = p.view !== undefined ? p.view : view; const pg = p.page;
    if (t) sp.set("type", t); if (c) sp.set("category", c); if (v) sp.set("view", v); if (pg) sp.set("page", pg);
    const qs = sp.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      {/* Compact header */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Browse</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="display text-2xl font-extrabold text-white tracking-tight">
              {type ? TYPES.find(t => t.value === type)?.label || type : "All"} Quizzes
            </h1>
            <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              {total.toLocaleString()} RESULTS
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {TYPES.map(t => (
            <Link key={t.value} href={buildUrl({ type: t.value || undefined, page: undefined })}
              className="display rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all"
              style={{
                borderColor: (type || "") === t.value ? "var(--cyan)" : "var(--gray-200)",
                background: (type || "") === t.value ? "var(--cyan-10)" : "var(--white)",
                color: (type || "") === t.value ? "var(--cyan)" : "var(--gray-500)",
              }}>
              {t.label}
            </Link>
          ))}
          <div className="ml-auto flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--gray-200)" }}>
            <Link href={buildUrl({ view: undefined })} className="display px-3 py-1.5 text-[11px] font-bold"
              style={{ background: !isTable ? "var(--gray-900)" : "var(--white)", color: !isTable ? "white" : "var(--gray-400)" }}>Grid</Link>
            <Link href={buildUrl({ view: "table" })} className="display px-3 py-1.5 text-[11px] font-bold"
              style={{ background: isTable ? "var(--gray-900)" : "var(--white)", color: isTable ? "white" : "var(--gray-400)" }}>Table</Link>
          </div>
        </div>

        {/* Category pills */}
        {liveCats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            <Link href={buildUrl({ category: undefined, page: undefined })}
              className="display rounded-lg px-3 py-1 text-[11px] font-bold"
              style={{ background: !category ? "var(--gray-900)" : "var(--gray-50)", color: !category ? "white" : "var(--gray-500)" }}>All Topics</Link>
            {liveCats.map(c => (
              <Link key={c.id} href={buildUrl({ category: c.term, page: undefined })}
                className="display rounded-lg px-3 py-1 text-[11px] font-bold"
                style={{ background: category === c.term ? "var(--gray-900)" : "var(--gray-50)", color: category === c.term ? "white" : "var(--gray-500)" }}>{c.title}</Link>
            ))}
          </div>
        )}

        {/* Results */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16"><p className="display font-bold" style={{ color: "var(--gray-400)" }}>No quizzes found</p></div>
        ) : isTable ? (
          <SortableTable quizzes={quizzes} />
        ) : (
          <QuizGrid quizzes={quizzes} />
        )}

        {totalPages > 1 && (
          <div className="mt-10 mb-8 flex items-center justify-center gap-3">
            {page > 1 && <Link href={buildUrl({ page: String(page - 1) })} className="display rounded-xl border px-5 py-2.5 text-sm font-bold hover:border-[var(--cyan)]" style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}>Previous</Link>}
            <span className="mono text-sm" style={{ color: "var(--gray-400)" }}>{page} / {totalPages}</span>
            {page < totalPages && <Link href={buildUrl({ page: String(page + 1) })} className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px" }}><span>Next</span></Link>}
          </div>
        )}
      </div>
    </div>
  );
}
