import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { deleteItem, getMyItems } from "../services/itemService";
import { getMyLeases, returnItem, requestExtension, approveBorrow, rejectBorrow, approveExtension, rejectExtension } from "../services/leaseService";

function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [leases, setLeases] = useState({ borrowed: [], lent: [] });
  const [loading, setLoading] = useState(true);
  const [extensionForm, setExtensionForm] = useState({ leaseId: "", days: "" });

  const fetchData = useCallback(async () => {
    try {
      const [itemsData, leasesData] = await Promise.all([getMyItems(), getMyLeases()]);
      setMyItems(itemsData);
      setLeases(leasesData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteItem(id);
      setMyItems(myItems.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Confirm return?")) return;
    try {
      await returnItem(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  const handleRequestExtension = async (e) => {
    e.preventDefault();
    try {
      await requestExtension(extensionForm.leaseId, Number(extensionForm.days));
      setExtensionForm({ leaseId: "", days: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Extension request failed");
    }
  };

  const handleApproveExtension = async (id) => {
    try {
      await approveExtension(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    }
  };

  const handleRejectExtension = async (id) => {
    try {
      await rejectExtension(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    }
  };

  const handleApproveBorrow = async (id) => {
    try {
      await approveBorrow(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    }
  };

  const handleRejectBorrow = async (id) => {
    try {
      await rejectBorrow(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    }
  };

  const statusBadge = (status) => {
    const styles = {
      Borrowed: "bg-accent-light text-accent",
      Returned: "bg-accent-light text-accent",
      Pending: "bg-accent-light text-accent",
      Overdue: "bg-red-50 text-red-700",
      "Extension Requested": "bg-accent-light text-accent",
      Approved: "bg-accent-light text-accent",
      Cancelled: "bg-surface text-muted",
    };
    return `text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-surface text-muted"}`;
  };

  const monogram = user?.name?.charAt(0)?.toUpperCase() || "?";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="rounded-xl border border-border bg-white p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="w-40 h-5 bg-stone-100 rounded-md animate-pulse" />
                <div className="w-56 h-4 bg-stone-100 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-white p-6 space-y-4">
              <div className="w-24 h-4 bg-stone-100 rounded-md animate-pulse" />
              <div className="h-12 bg-stone-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-stone-100 rounded-lg animate-pulse" />
            </div>
            <div className="rounded-xl border border-border bg-white p-6 space-y-4">
              <div className="w-28 h-4 bg-stone-100 rounded-md animate-pulse" />
              <div className="h-12 bg-stone-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="rounded-xl border border-border bg-white p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-lg shrink-0">
              {monogram}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-text truncate">{user?.name || "User"}</h1>
              <p className="text-sm text-secondary truncate">{user?.collegeEmail || ""}</p>
              <p className="text-xs text-muted mt-0.5">
                {[user?.hostelBlock, user?.roomNumber].filter(Boolean).join(" · ") || "No hostel details"}
              </p>
            </div>
            <Link
              to="/edit-profile"
              className="text-xs px-4 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors shrink-0"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text">Listed Items</h2>
              <Link to="/create" className="text-xs font-medium text-text hover:opacity-70 transition-opacity">+ New</Link>
            </div>

            {myItems.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-8 h-8 text-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-3 text-sm text-secondary">No items listed yet.</p>
                <Link to="/create" className="mt-3 inline-block text-xs font-medium text-accent hover:underline">Create your first listing</Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {myItems.map((item) => (
                  <li key={item._id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{item.title}</p>
                      <p className="text-xs text-muted mt-0.5">{item.category}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-text mb-5">Borrowed Items</h2>

            {leases.borrowed.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-8 h-8 text-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="mt-3 text-sm text-secondary">No borrowed items.</p>
                <Link to="/marketplace" className="mt-3 inline-block text-xs font-medium text-accent hover:underline">Browse marketplace</Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {leases.borrowed.map((lease) => (
                  <li key={lease._id} className="rounded-lg border border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">{lease.item?.title || "Unknown"}</p>
                        <p className="text-xs text-muted mt-0.5">Due {new Date(lease.expectedReturnDate).toLocaleDateString()}</p>
                      </div>
                      <span className={statusBadge(lease.status)}>{lease.status}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {lease.status === "Borrowed" && (
                        <>
                          <button
                            onClick={() => setExtensionForm({ leaseId: lease._id, days: "" })}
                            className="text-xs px-3 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
                          >
                            Extend
                          </button>
                          <button
                            onClick={() => handleReturn(lease._id)}
                            className="text-xs px-3 py-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                          >
                            Return
                          </button>
                        </>
                      )}
                      {lease.status === "Extension Requested" && (
                        <span className="text-xs text-muted">Awaiting approval</span>
                      )}
                    </div>

                    {extensionForm.leaseId === lease._id && (
                      <form onSubmit={handleRequestExtension} className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          value={extensionForm.days}
                          onChange={(e) => setExtensionForm({ ...extensionForm, days: e.target.value })}
                          className="w-20 border border-border rounded-lg px-3 py-1.5 text-xs text-text outline-none focus:border-text transition-colors"
                          placeholder="Days"
                          min="1"
                          required
                        />
                        <button type="submit" className="text-xs px-3 py-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors">
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setExtensionForm({ leaseId: "", days: "" })}
                          className="text-xs px-3 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-text mb-5">Lent Items</h2>

          {leases.lent.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 text-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-3 text-sm text-secondary">No items lent out.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {leases.lent.map((lease) => {
                const contactParts = [lease.borrower?.collegeEmail, lease.borrower?.hostelBlock, lease.borrower?.roomNumber].filter(Boolean);
                return (
                  <li key={lease._id} className="rounded-lg border border-border px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text truncate">{lease.item?.title || "Unknown"}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {lease.borrower?.name || "Unknown"} &middot; Due {new Date(lease.expectedReturnDate).toLocaleDateString()}
                        </p>
                        {contactParts.length > 0 && (
                          <p className="text-xs text-text/60 mt-1 truncate">{contactParts.join(" · ")}</p>
                        )}
                        {(lease.contactRoom || lease.contactBlock || lease.contactPhone) && (
                          <p className="text-xs text-accent mt-0.5 truncate">
                            {[lease.contactRoom, lease.contactBlock, lease.contactPhone].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <span className={statusBadge(lease.status)}>{lease.status}</span>
                        {lease.status === "Pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleApproveBorrow(lease._id)}
                              className="text-xs px-3 py-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectBorrow(lease._id)}
                              className="text-xs px-3 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {lease.status === "Extension Requested" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleApproveExtension(lease._id)}
                              className="text-xs px-3 py-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectExtension(lease._id)}
                              className="text-xs px-3 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
