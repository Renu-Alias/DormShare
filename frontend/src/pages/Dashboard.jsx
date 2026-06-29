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
      const [itemsData, leasesData] = await Promise.all([
        getMyItems(),
        getMyLeases(),
      ]);
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
      "Borrowed": "bg-blue-50 text-blue-700",
      "Returned": "bg-green-50 text-green-700",
      "Pending": "bg-yellow-50 text-yellow-700",
      "Overdue": "bg-red-50 text-red-700",
      "Extension Requested": "bg-purple-50 text-purple-700",
      "Approved": "bg-blue-50 text-blue-700",
      "Cancelled": "bg-slate-50 text-slate-500",
    };
    return `text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-slate-50 text-slate-500"}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-400">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your listings and borrowed items.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">

          {/* My Listings */}
          <div className="rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">My Listings</h2>
              <Link to="/create" className="text-xs font-medium text-accent hover:opacity-80">
                + New
              </Link>
            </div>

            {myItems.length === 0 ? (
              <p className="text-sm text-slate-400">No listings yet.</p>
            ) : (
              <ul className="space-y-2">
                {myItems.map((item) => (
                  <li key={item._id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0 ml-2"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Borrowed Items */}
          <div className="rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Borrowed Items</h2>

            {leases.borrowed.length === 0 ? (
              <p className="text-sm text-slate-400">No borrowed items.</p>
            ) : (
              <ul className="space-y-2">
                {leases.borrowed.map((lease) => (
                  <li key={lease._id} className="rounded-md border border-border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{lease.item?.title || "Unknown"}</p>
                        <p className="text-xs text-slate-400">
                          Due {new Date(lease.expectedReturnDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={statusBadge(lease.status)}>{lease.status}</span>
                    </div>

                    <div className="mt-2 flex gap-2">
                      {lease.status === "Borrowed" && (
                        <>
                          <button
                            onClick={() => setExtensionForm({ leaseId: lease._id, days: "" })}
                            className="text-xs px-2.5 py-1 rounded-md border border-border text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Extend
                          </button>
                          <button
                            onClick={() => handleReturn(lease._id)}
                            className="text-xs px-2.5 py-1 rounded-md bg-accent text-white hover:opacity-90 transition-opacity"
                          >
                            Return
                          </button>
                        </>
                      )}
                      {lease.status === "Extension Requested" && (
                        <span className="text-xs text-slate-400">Awaiting approval</span>
                      )}
                    </div>

                    {extensionForm.leaseId === lease._id && (
                      <form onSubmit={handleRequestExtension} className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          value={extensionForm.days}
                          onChange={(e) => setExtensionForm({ ...extensionForm, days: e.target.value })}
                          className="w-16 border border-border rounded-md px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="Days"
                          min="1"
                          required
                        />
                        <button type="submit" className="text-xs px-2.5 py-1 rounded-md bg-accent text-white hover:opacity-90 transition-opacity">
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setExtensionForm({ leaseId: "", days: "" })}
                          className="text-xs px-2.5 py-1 rounded-md border border-border text-slate-500 hover:bg-slate-50 transition-colors"
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

        {/* Lent Items */}
        <div className="mt-6 rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Lent Items</h2>

          {leases.lent.length === 0 ? (
            <p className="text-sm text-slate-400">No items lent out.</p>
          ) : (
            <ul className="space-y-2">
              {leases.lent.map((lease) => (
                <li key={lease._id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{lease.item?.title || "Unknown"}</p>
                    <p className="text-xs text-slate-400">
                      {lease.borrower?.name || "Unknown"} &middot; Due {new Date(lease.expectedReturnDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={statusBadge(lease.status)}>{lease.status}</span>
                    {lease.status === "Extension Requested" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApproveExtension(lease._id)}
                          className="text-xs px-2.5 py-1 rounded-md bg-accent text-white hover:opacity-90 transition-opacity"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectExtension(lease._id)}
                          className="text-xs px-2.5 py-1 rounded-md border border-border text-slate-600 hover:bg-slate-50 transition-colors"
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
