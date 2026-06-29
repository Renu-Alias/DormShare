import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [condition, setCondition] = useState("Like New");
  const [transactionType, setTransactionType] = useState("Free to Borrow");
  const [price, setPrice] = useState(0);
  const [hostelBlock, setHostelBlock] = useState("A Block");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("transactionType", transactionType);
      formData.append("price", price);
      formData.append("hostelBlock", hostelBlock);
      images.forEach((file) => formData.append("images", file));

      await createItem(formData);
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create Listing</h1>
        <p className="mt-1 text-sm text-slate-500">Share an item with your campus community.</p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none"
              required
              minLength={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                id="cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option>Books</option>
                <option>Electronics</option>
                <option>Bedding</option>
                <option>Furniture</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="cond" className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select
                id="cond"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option>Like New</option>
                <option>Gently Used</option>
                <option>Heavy Wear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="txn" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                id="txn"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option>Free to Borrow</option>
                <option>Available for Lease</option>
              </select>
            </div>

            <div>
              <label htmlFor="block" className="block text-sm font-medium text-slate-700 mb-1">Hostel Block</label>
              <select
                id="block"
                value={hostelBlock}
                onChange={(e) => setHostelBlock(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option>A Block</option>
                <option>B Block</option>
                <option>C Block</option>
                <option>D Block</option>
              </select>
            </div>
          </div>

          {transactionType === "Available for Lease" && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (&there4;)</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                min="0"
              />
            </div>
          )}

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-1">Images</label>
            <input
              id="images"
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-border file:text-sm file:font-medium file:text-slate-700 file:bg-white hover:file:bg-slate-50"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateListing;
