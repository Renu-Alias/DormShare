import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <p className="text-sm font-medium text-secondary uppercase tracking-widest mb-5">
          Campus Micro-Leasing
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text leading-[1.1]">
          Borrow what you need.<br />Share what you don&apos;t.
        </h1>
        <p className="mt-5 text-base text-secondary leading-relaxed max-w-lg mx-auto">
          DormShare connects students to borrow, lease, and share campus essentials — no need to buy everything new.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/marketplace"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Browse Marketplace
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-2.5 rounded-full border border-border text-secondary text-sm font-medium hover:bg-white hover:text-text transition-colors"
          >
            List an Item
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
