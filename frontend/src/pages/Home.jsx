import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchBar />

      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Browse by Category</h2>
          <p className="mt-1 text-sm text-secondary">Find what you need from your fellow students.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CategoryCard title="Books" />
          <CategoryCard title="Electronics" />
          <CategoryCard title="Bedding" />
          <CategoryCard title="Furniture" />
          <CategoryCard title="Others" />
        </div>
      </section>
    </>
  );
}

export default Home;
