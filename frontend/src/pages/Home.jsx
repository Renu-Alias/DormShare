import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-text">Browse by Category</h2>
          <p className="mt-2 text-sm text-secondary">Find what you need from your fellow students.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CategoryCard title="Books" />
          <CategoryCard title="Electronics" />
          <CategoryCard title="Bedding" />
          <CategoryCard title="Furniture" />
          <CategoryCard title="Kitchen" />
          <CategoryCard title="Clothing" />
          <CategoryCard title="Sports & Fitness" />
          <CategoryCard title="Stationery" />
          <CategoryCard title="Appliances" />
          <CategoryCard title="Others" />
        </div>
      </section>
    </>
  );
}

export default Home;
