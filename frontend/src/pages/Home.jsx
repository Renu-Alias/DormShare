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

      <section className="max-w-7xl mx-auto py-20 px-8">

        <h2 className="text-4xl font-bold mb-10 text-center">
          Browse Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          <CategoryCard title="Books" emoji="📚" />

          <CategoryCard title="Electronics" emoji="💻" />

          <CategoryCard title="Bedding" emoji="🛏️" />

          <CategoryCard title="Furniture" emoji="🪑" />

          <CategoryCard title="Others" emoji="📦" />

        </div>

      </section>

    </>
  );
}

export default Home;