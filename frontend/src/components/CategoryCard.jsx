import { Link } from "react-router-dom";

const icons = {
  Books: [
    "M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20", // outline
    "M4 19.5A2.5 2.5 0 016.5 17H20", // accent stroke
  ],
  Electronics: [
    "M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z",
    "M9 19l1 1h4l1-1",
  ],
  Bedding: [
    "M3 7l9-4 9 4",
    "M3 7v10l9 4m0-14v14",
  ],
  Furniture: [
    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    "M9 22V12h6v10",
  ],
  Kitchen: [
    "M15 15l-6-6m6 6l-3 3m3-3l3-3",
    "M12 21a9 9 0 100-18 9 9 0 000 18z",
  ],
  Clothing: [
    "M16 7a4 4 0 11-8 0 4 4 0 018 0z",
    "M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  ],
  "Sports & Fitness": [
    "M13 10V3L4 14h7v7l9-11h-7z",
    "M13 10V3",
  ],
  Stationery: [
    "M15.232 5.232l3.536 3.536M9 11l-3.536 3.536",
    "M6.5 21.036H3v-3.572L16.732 3.732a2.5 2.5 0 113.536 3.536L6.5 21.036z",
  ],
  Appliances: [
    "M12 21a9 9 0 100-18 9 9 0 000 18z",
    "M12 7v6l3 3",
  ],
  Others: [
    "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z",
    "M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  ],
};

function CategoryCard({ title }) {
  const [outline, accent] = icons[title] || ["", ""];

  return (
    <Link to={`/marketplace?category=${encodeURIComponent(title)}`}>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white px-6 py-8 shadow-sm hover:shadow-md hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          {outline && <path strokeLinecap="round" strokeLinejoin="round" d={outline} className="text-muted" />}
          {accent && <path strokeLinecap="round" strokeLinejoin="round" d={accent} className="text-accent" strokeWidth={1.8} />}
        </svg>
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
