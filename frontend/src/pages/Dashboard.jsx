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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 text-center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          My Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* My Listings */}
          <div className="border rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              My Listings
            </h2>

            {myItems.length === 0 ? (
              <p className="text-gray-500 mb-4">No listings yet.</p>
            ) : (
              <ul className="space-y-3">
                {myItems.map((item) => (
                  <li key={item._id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/create"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Create Listing
            </Link>
          </div>

          {/* Borrowed Items */}
          <div className="border rounded-lg shadow p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Borrowed Items
            </h2>

            {leases.borrowed.length === 0 ? (
              <p className="text-gray-500">No borrowed items.</p>
            ) : (
              <ul className="space-y-3">
                {leases.borrowed.map((lease) => (
                  <li key={lease._id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{lease.item?.title || "Unknown"}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        Due: {new Date(lease.expectedReturnDate).toLocaleDateString()}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        lease.status === "Overdue" ? "bg-red-100 text-red-800" :
                        lease.status === "Borrowed" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {lease.status}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {lease.status === "Borrowed" && (
                        <>
                          <button
                            onClick={() => setExtensionForm({ leaseId: lease._id, days: "" })}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Extend
                          </button>
                          <button
                            onClick={() => handleReturn(lease._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Return
                          </button>
                        </>
                      )}
                      {lease.status === "Extension Requested" && (
                        <span className="text-yellow-600 text-sm">Pending approval</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {extensionForm.leaseId && (
              <form onSubmit={handleRequestExtension} className="mt-4 p-3 border rounded bg-gray-50 flex gap-2 items-end">
                <div>
                  <label className="block text-sm mb-1">Extension Days</label>
                  <input
                    type="number"
                    value={extensionForm.days}
                    onChange={(e) => setExtensionForm({ ...extensionForm, days: e.target.value })}
                    className="border rounded p-2 w-24"
                    min="1"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setExtensionForm({ leaseId: "", days: "" })}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Lent Items */}
          <div className="border rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">
              Lent Items
            </h2>

            {leases.lent.length === 0 ? (
              <p className="text-gray-500">No items lent out.</p>
            ) : (
              <ul className="space-y-3">
                {leases.lent.map((lease) => (
                  <li key={lease._id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{lease.item?.title || "Unknown"}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        Borrower: {lease.borrower?.name || "Unknown"}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        Due: {new Date(lease.expectedReturnDate).toLocaleDateString()}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        lease.status === "Extension Requested" ? "bg-yellow-100 text-yellow-800" :
                        lease.status === "Borrowed" ? "bg-blue-100 text-blue-800" :
                        lease.status === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {lease.status}
                      </span>
                    </div>
                    <div>
                      {lease.status === "Extension Requested" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveExtension(lease._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectExtension(lease._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
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

      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
