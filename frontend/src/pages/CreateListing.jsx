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

      images.forEach((file) => {
        formData.append("images", file);
      });

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

      <div className="max-w-3xl mx-auto mt-10 mb-10 shadow-lg rounded-lg p-8">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Create New Listing
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border rounded p-3"
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded p-3"
            >
              <option>Books</option>
              <option>Electronics</option>
              <option>Bedding</option>
              <option>Furniture</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border rounded p-3"
            >
              <option>Like New</option>
              <option>Gently Used</option>
              <option>Heavy Wear</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full border rounded p-3"
            >
              <option>Free to Borrow</option>
              <option>Available for Lease</option>
            </select>
          </div>

          {transactionType === "Available for Lease" && (
            <div>
              <label className="block mb-2 font-medium">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border rounded p-3"
                min="0"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Hostel Block
            </label>
            <select
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full border rounded p-3"
            >
              <option>A Block</option>
              <option>B Block</option>
              <option>C Block</option>
              <option>D Block</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="w-full"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
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
