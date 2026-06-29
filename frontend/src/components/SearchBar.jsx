import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    navigate(query ? `/marketplace?search=${encodeURIComponent(query)}` : "/marketplace");
  };

  return (
    <div className="max-w-lg mx-auto px-8">
      <form onSubmit={handleSubmit} className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          name="search"
          type="text"
          placeholder="Search items..."
          className="w-full pl-10 pr-20 py-2.5 bg-white border border-border rounded-full text-sm text-text placeholder-muted outline-none focus:border-text transition-colors"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
