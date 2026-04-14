"use client";

interface Props {
  items: { id: number; title: string; description: string; photo: string }[];
}

export function ListViewer({ items }: Props) {
  if (items.length === 0) {
    return <div className="text-center py-12"><p className="text-4xl mb-3">📝</p><p style={{ color: "var(--gray-500)" }}>No items.</p></div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-4 rounded-2xl border p-4 transition-colors"
          style={{ borderColor: "var(--gray-100)", background: "var(--white)" }}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
            style={{
              background: i < 3 ? "var(--neon-gradient)" : "var(--gray-100)",
              color: i < 3 ? "var(--white)" : "var(--gray-400)",
              fontFamily: "var(--font-display)",
            }}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" style={{ color: "var(--gray-900)", fontFamily: "var(--font-display)" }}>
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: "var(--gray-400)" }}>{item.description}</p>
            )}
          </div>
          {item.photo && (
            <img src={`/uploads/${item.photo}`} alt={item.title}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </div>
      ))}
    </div>
  );
}
