import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";

function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[5%] right-[-5%] w-[350px] h-[350px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(circle, #0d9488 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Navbar />
      <Hero />

      <section className="relative max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-text">Browse by Category</h2>
          <p className="mt-2 text-sm text-secondary">Find what you need from your fellow students.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
    </div>
  );
}

export default Home;
