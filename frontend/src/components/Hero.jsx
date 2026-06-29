import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-8 text-center">

        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
          Share. Borrow. Lease.
        </h1>

        <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
          DormShare helps students rent, borrow and share campus essentials
          instead of buying everything new.
        </p>

        <Link
          to="/marketplace"
          className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          Browse Marketplace
        </Link>

      </div>
    </section>
  );
}

export default Hero;