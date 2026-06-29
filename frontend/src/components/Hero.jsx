import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Share. Borrow. Save.
        </h1>
        <p className="mt-5 text-lg text-slate-500 leading-relaxed">
          DormShare connects students to borrow, lease, and share campus essentials — no need to buy everything new.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/marketplace"
            className="inline-flex items-center px-5 py-2.5 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Marketplace
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center px-5 py-2.5 rounded-md border border-border text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            List an Item
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
