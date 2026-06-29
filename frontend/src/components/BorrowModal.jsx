import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { borrowItem } from "../services/leaseService";

function BorrowModal({ item, onClose, onSuccess }) {
  const { user } = useAuth();
  const [returnDate, setReturnDate] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const valid = returnDate && contactPhone.trim().length >= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError("");
    try {
      await borrowItem(item._id, new Date(returnDate).toISOString(), user?.roomNumber || "", user?.hostelBlock || "", contactPhone.trim());
      setDone(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLease = item.transactionType === "Available for Lease";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-white shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-6">
            <svg className="w-10 h-10 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-3 text-sm font-medium text-text">Request submitted!</p>
            <p className="mt-1 text-xs text-muted">The lender will review your request.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-text">{isLease ? "Lease" : "Borrow"} Item</h3>
              <button onClick={onClose} className="text-muted hover:text-text transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 pb-4 border-b border-border">
              <p className="text-sm font-medium text-text">{item.title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                <span>{item.transactionType}</span>
                {isLease && <><span className="w-1 h-1 rounded-full bg-border" /><span className="font-medium text-accent">₹{item.price}</span></>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-muted">
                Room: <span className="font-medium text-text">{user?.roomNumber || "—"}</span>
                {" · "}Block: <span className="font-medium text-text">{user?.hostelBlock || "—"}</span>
              </p>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-text transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text mb-1.5">Expected Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  min={minDateStr}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-text transition-colors"
                  required
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs px-4 py-2 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                  disabled={submitting || !valid}
                >
                  {submitting ? "Submitting..." : isLease ? "Confirm Lease" : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BorrowModal;
