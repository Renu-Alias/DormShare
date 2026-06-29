import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
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

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/marketplace"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Browse Marketplace
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-text hover:bg-surface transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
