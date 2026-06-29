
function ItemCard({ item }) {
  const title = item.title;
  const price = item.price || 0;
  const hostel = item.hostelBlock;
  const category = item.category;

  return (
    <div className="border rounded-lg shadow p-4">
      {item.images && item.images.length > 0 ? (
        <img
          src={`http://localhost:5000${item.images[0]}`}
          alt={title}
          className="w-full rounded mb-3 h-48 object-cover"
        />
      ) : (
        <div className="w-full bg-gray-200 rounded mb-3 h-48 flex items-center justify-center text-gray-400">
          No image
        </div>
      )}

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="text-gray-600">{category}</p>

      <p className="mt-2 font-bold text-blue-600">₹ {price}</p>

      <p className="text-sm text-gray-500">Hostel: {hostel}</p>

      <p className="text-sm text-gray-500">Owner: {item.owner?.name || "Unknown"}</p>

      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">
        View Details
      </button>
    </div>
  );
}

export default ItemCard;
