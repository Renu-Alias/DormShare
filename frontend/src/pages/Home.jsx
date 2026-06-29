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

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 text-center">
          Browse by Category
        </h2>
        <p className="mt-2 text-sm text-slate-500 text-center">
          Find what you need from your fellow students.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
