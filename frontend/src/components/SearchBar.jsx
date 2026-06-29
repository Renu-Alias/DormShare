import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    navigate(query ? `/marketplace?search=${encodeURIComponent(query)}` : "/marketplace");
  };

  return (
    <div className="max-w-xl mx-auto px-6 -mt-6 relative z-10">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white rounded-lg border border-border px-3 py-2 shadow-sm">
        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          name="search"
          type="text"
          placeholder="Search items..."
          className="flex-1 text-sm outline-none py-1.5 text-slate-900 placeholder-slate-400"
        />
        <button type="submit" className="text-sm px-4 py-1.5 rounded-md bg-accent text-white hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
