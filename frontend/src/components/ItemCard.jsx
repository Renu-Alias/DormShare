function ItemCard({ item }) {
  const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  return (
    <div className="rounded-lg border border-border bg-white hover:shadow-sm transition-shadow">
      {item.images && item.images.length > 0 ? (
        <img
          src={`${apiUrl}${item.images[0]}`}
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-slate-50 rounded-t-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-slate-900 text-sm leading-snug">{item.title}</h3>
          {item.transactionType === "Available for Lease" && (
            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">&there4; {item.price || 0}</span>
          )}
        </div>

        <p className="mt-1 text-xs text-slate-500">{item.category}</p>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>{item.hostelBlock}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{item.owner?.name || "Unknown"}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
