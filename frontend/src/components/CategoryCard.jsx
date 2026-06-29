import { Link } from "react-router-dom";

function CategoryCard({ title, emoji }) {
  return (
    <Link to={`/marketplace?category=${title}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-6 text-center cursor-pointer">

        <div className="text-5xl mb-4">
          {emoji}
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>

      </div>
    </Link>
  );
}

export default CategoryCard;