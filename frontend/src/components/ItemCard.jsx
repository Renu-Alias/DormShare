function ItemCard({ item }) {
  const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-sm hover:border-accent/20 transition-all duration-200">
      {item.images && item.images.length > 0 ? (
        <img
          src={`${apiUrl}${item.images[0]}`}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-surface flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-text leading-snug">{item.title}</h3>
          {item.transactionType === "Available for Lease" && (
            <span className="text-sm font-semibold text-accent whitespace-nowrap">₹{item.price || 0}</span>
          )}
        </div>

        <p className="mt-1 text-xs text-muted">{item.category}</p>

        <div className="mt-4 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted">
          <span>{item.hostelBlock}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{item.owner?.name || "Unknown"}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
