import { Link } from "react-router-dom";

const icons = {
  Books: [
    "M4 4h16v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",
    "M8 8h8v1H8zM8 11h6v1H8zM8 14h4v1H8z",
  ],
  Electronics: [
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M10 19h4",
  ],
  Bedding: [
    "M3 8l9-5 9 5v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
    "M12 3v18",
  ],
  Furniture: [
    "M5 3h14a2 2 0 012 2v4H3V5a2 2 0 012-2z",
    "M9 21V9h6v12",
  ],
  Kitchen: [
    "M8 3h8v5a4 4 0 01-4 4 4 4 0 01-4-4V3z",
    "M12 12v8M8 21h8",
  ],
  Clothing: [
    "M7 3h10a2 2 0 012 2v3l-4 2v4l-5 5-5-5v-4L5 5a2 2 0 012-2z",
    "M12 3v16",
  ],
  "Sports & Fitness": [
    "M12 21a9 9 0 100-18 9 9 0 000 18z",
    "M12 7v5l3 3",
  ],
  Stationery: [
    "M10 3v8l-3 3 3 3v4h4v-4l3-3-3-3V3h-4z",
    "M7 14h10",
  ],
  Appliances: [
    "M5 5a2 2 0 012-2h10a2 2 0 012 2v16H5V5z",
    "M8 13h8v6H8z",
  ],
  Others: [
    "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    "",
  ],
};

function CategoryCard({ title }) {
  const [bg, fg] = icons[title] || ["", ""];

  return (
    <Link to={`/marketplace?category=${encodeURIComponent(title)}`}>
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-gradient-to-br from-white to-accent-light/40 px-6 py-9 shadow-sm hover:shadow-lg hover:shadow-accent/5 hover:border-accent/25 hover:-translate-y-1 transition-all duration-300">
        <div className="relative">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#0d9488" fillOpacity="0.08" />
            {bg && <path d={bg} fill="#0d9488" fillOpacity="0.25" />}
            {fg && <path d={fg} fill="#0d9488" />}
          </svg>
        </div>
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
