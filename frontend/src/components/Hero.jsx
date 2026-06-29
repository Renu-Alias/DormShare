import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    navigate(query ? `/marketplace?search=${encodeURIComponent(query)}` : "/marketplace");
  };

  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-12">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <p className="text-sm font-medium text-accent uppercase tracking-[0.15em] mb-4">
          Campus Micro-Leasing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text leading-[1.1]">
          Borrow what you need.<br />Share what you don&apos;t.
        </h1>
        <p className="mt-4 text-base text-secondary leading-relaxed max-w-lg mx-auto">
          DormShare connects students to borrow, lease, and share campus essentials — no need to buy everything new.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center shadow-md bg-white rounded-full border border-border focus-within:border-accent focus-within:shadow-lg transition-all duration-200">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              name="search"
              type="text"
              placeholder="Search items..."
              className="flex-1 pl-12 pr-4 py-3 bg-transparent rounded-full text-sm text-text placeholder-muted outline-none"
            />
            <button
              type="submit"
              className="mr-1.5 p-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;
