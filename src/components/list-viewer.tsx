interface Props {
  items: {
    id: number;
    title: string;
    description: string;
    photo: string;
  }[];
}

export function ListViewer({ items }: Props) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500">No items in this list.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {i + 1}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            )}
          </div>
          {item.photo && (
            <img
              src={`/uploads/${item.photo}`}
              alt={item.title}
              className="ml-auto h-16 w-16 shrink-0 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
