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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Marketplace
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2"
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
            className="border rounded p-2"
          >
            <option value="">All Hostels</option>
            <option>A Block</option>
            <option>B Block</option>
            <option>C Block</option>
            <option>D Block</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default Marketplace;
