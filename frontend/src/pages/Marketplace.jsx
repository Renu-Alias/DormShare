import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import { getItems } from "../services/itemService";

function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [hostelBlock, setHostelBlock] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      const s = searchParams.get("search");
      const c = searchParams.get("category");
      if (s) params.search = s;
      if (c) params.category = c;
      const { items: data } = await getItems(params);
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (hostelBlock) params.set("hostelBlock", hostelBlock);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Marketplace</h1>
        <p className="mt-1 text-sm text-slate-500">Browse items shared by your peers.</p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All Categories</option>
            <option>Books</option>
            <option>Electronics</option>
            <option>Bedding</option>
            <option>Furniture</option>
            <option>Others</option>
          </select>

          <select
            value={hostelBlock}
            onChange={(e) => setHostelBlock(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All Hostels</option>
            <option>A Block</option>
            <option>B Block</option>
            <option>C Block</option>
            <option>D Block</option>
          </select>

          <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
            Search
          </button>
        </form>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-slate-400">Loading items...</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-10 h-10 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-3 text-sm text-slate-500">No items found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Marketplace;
