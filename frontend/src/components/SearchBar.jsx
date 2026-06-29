import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchBar() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      navigate(`/marketplace?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <div className="max-w-3xl mx-auto -mt-10 relative z-10">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-3 flex items-center">

        <Search className="text-gray-500 ml-3" size={22} />

        <input
          name="search"
          type="text"
          placeholder="Search books, lamps, mattresses..."
          className="w-full px-4 py-3 outline-none"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
          Search
        </button>

      </form>
    </div>
  );
}

export default SearchBar;
