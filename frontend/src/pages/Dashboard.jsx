import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { deleteItem, getMyItems } from "../services/itemService";
import { getMyLeases, returnItem, requestExtension, approveExtension, rejectExtension } from "../services/leaseService";

function Dashboard() {
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-12 text-sm text-muted">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold tracking-tight text-text">Dashboard</h1>
          <p className="mt-2 text-sm text-secondary">Manage your listings and borrowed items.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text">My Listings</h2>
              <Link to="/create" className="text-xs font-medium text-text hover:opacity-70 transition-opacity">+ New</Link>
            </div>

            {myItems.length === 0 ? (
              <p className="text-sm text-muted">No listings yet.</p>
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
              <p className="text-sm text-muted">No borrowed items.</p>
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
            <p className="text-sm text-muted">No items lent out.</p>
          ) : (
            <ul className="space-y-2">
              {leases.lent.map((lease) => (
                <li key={lease._id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{lease.item?.title || "Unknown"}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {lease.borrower?.name || "Unknown"} &middot; Due {new Date(lease.expectedReturnDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className={statusBadge(lease.status)}>{lease.status}</span>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
