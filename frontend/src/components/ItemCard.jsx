import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BorrowModal from "./BorrowModal";

function ItemCard({ item, onBorrow }) {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  const showPlaceholder = !item.images || item.images.length === 0 || imgError;
  const isOwn = user?._id === item.owner?._id || user?._id === item.owner?.id;
  const isLease = item.transactionType === "Available for Lease";
  const canBorrow = item.isAvailable && !isOwn;

  return (
    <>
      <div className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-sm hover:border-accent/20 transition-all duration-200 flex flex-col">
        {showPlaceholder ? (
          <div className="w-full h-48 bg-surface flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={`${apiUrl}${item.images[0]}`}
            alt={item.title}
            className="w-full h-48 object-cover"
            onError={() => setImgError(true)}
          />
        )}

        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-text leading-snug">{item.title}</h3>
              {isLease && (
                <span className="text-sm font-semibold text-accent whitespace-nowrap">₹{item.price || 0}</span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted">{item.category}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted">
            <span>{item.hostelBlock}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{item.owner?.name || "Unknown"}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            {isOwn ? (
              <span className="inline-block text-xs text-muted bg-surface rounded-full px-3 py-1">Your item</span>
            ) : canBorrow ? (
              <button
                onClick={() => setShowModal(true)}
                className="w-full text-xs font-medium py-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                {isLease ? "Lease Now" : "Request to Borrow"}
              </button>
            ) : (
              <span className="inline-block text-xs text-muted bg-surface rounded-full px-3 py-1">Not available</span>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <BorrowModal
          item={item}
          onClose={() => setShowModal(false)}
          onSuccess={() => onBorrow?.(item._id)}
        />
      )}
    </>
  );
}

export default ItemCard;
