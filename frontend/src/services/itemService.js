import api from "./api";

const mockItems = [
  {
    _id: "1", title: "Calculus Textbook", category: "Books", description: "Like new condition",
    condition: "Like New", transactionType: "Free to Borrow", price: 0,
    hostelBlock: "A Block", images: [], isAvailable: true,
    owner: { _id: "u1", name: "Alice", collegeEmail: "alice@college.edu", hostelBlock: "A Block" },
  },
  {
    _id: "2", title: "Desk Lamp", category: "Electronics", description: "LED desk lamp, gently used",
    condition: "Gently Used", transactionType: "Available for Lease", price: 50,
    hostelBlock: "B Block", images: [], isAvailable: true,
    owner: { _id: "u2", name: "Bob", collegeEmail: "bob@college.edu", hostelBlock: "B Block" },
  },
  {
    _id: "3", title: "Single Bed Mattress", category: "Bedding", description: "Memory foam mattress topper",
    condition: "Like New", transactionType: "Free to Borrow", price: 0,
    hostelBlock: "C Block", images: [], isAvailable: true,
    owner: { _id: "u3", name: "Carol", collegeEmail: "carol@college.edu", hostelBlock: "C Block" },
  },
  {
    _id: "4", title: "Study Table", category: "Furniture", description: "Compact foldable study table",
    condition: "Heavy Wear", transactionType: "Available for Lease", price: 100,
    hostelBlock: "D Block", images: [], isAvailable: true,
    owner: { _id: "u4", name: "Dave", collegeEmail: "dave@college.edu", hostelBlock: "D Block" },
  },
  {
    _id: "5", title: "Rice Cooker", category: "Kitchen", description: "Compact 2-cup rice cooker",
    condition: "Gently Used", transactionType: "Free to Borrow", price: 0,
    hostelBlock: "A Block", images: [], isAvailable: true,
    owner: { _id: "u1", name: "Alice", collegeEmail: "alice@college.edu", hostelBlock: "A Block" },
  },
  {
    _id: "6", title: "Winter Jacket", category: "Clothing", description: "Warm down jacket, size L",
    condition: "Like New", transactionType: "Available for Lease", price: 30,
    hostelBlock: "B Block", images: [], isAvailable: true,
    owner: { _id: "u2", name: "Bob", collegeEmail: "bob@college.edu", hostelBlock: "B Block" },
  },
  {
    _id: "7", title: "Yoga Mat", category: "Sports & Fitness", description: "Non-slip exercise mat",
    condition: "Gently Used", transactionType: "Free to Borrow", price: 0,
    hostelBlock: "C Block", images: [], isAvailable: true,
    owner: { _id: "u3", name: "Carol", collegeEmail: "carol@college.edu", hostelBlock: "C Block" },
  },
  {
    _id: "8", title: "Notebook Bundle", category: "Stationery", description: "Pack of 5 spiral notebooks",
    condition: "Like New", transactionType: "Free to Borrow", price: 0,
    hostelBlock: "D Block", images: [], isAvailable: true,
    owner: { _id: "u4", name: "Dave", collegeEmail: "dave@college.edu", hostelBlock: "D Block" },
  },
  {
    _id: "9", title: "Mini Fridge", category: "Appliances", description: "4L mini fridge, works great",
    condition: "Gently Used", transactionType: "Available for Lease", price: 80,
    hostelBlock: "A Block", images: [], isAvailable: true,
    owner: { _id: "u1", name: "Alice", collegeEmail: "alice@college.edu", hostelBlock: "A Block" },
  },
];

const filterMock = (params) => {
  let filtered = [...mockItems];
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }
  if (params.category) filtered = filtered.filter((i) => i.category === params.category);
  if (params.hostelBlock) filtered = filtered.filter((i) => i.hostelBlock === params.hostelBlock);
  return { items: filtered, totalPages: 1, currentPage: 1, total: filtered.length };
};

const isNetworkError = (err) => !err.response && err.message !== "canceled";

export const getItems = async (params = {}) => {
  try {
    const { data } = await api.get("/items", { params });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return filterMock(params);
    throw err;
  }
};

export const getMyItems = async () => {
  try {
    const { data } = await api.get("/items/myitems");
    return data;
  } catch (err) {
    if (isNetworkError(err)) return [];
    throw err;
  }
};

export const getItemById = async (id) => {
  try {
    const { data } = await api.get(`/items/${id}`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mockItems.find((i) => i._id === id) || null;
    throw err;
  }
};

export const createItem = async (formData) => {
  try {
    const { data } = await api.post("/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { _id: Date.now().toString(), message: "Created (offline demo)" };
    throw err;
  }
};

export const updateItem = async (id, formData) => {
  try {
    const { data } = await api.put(`/items/${id}`, formData);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { _id: id, message: "Updated (offline demo)" };
    throw err;
  }
};

export const deleteItem = async (id) => {
  try {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Deleted (offline demo)" };
    throw err;
  }
};

export const toggleAvailability = async (id) => {
  try {
    const { data } = await api.patch(`/items/${id}/availability`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Toggled (offline demo)" };
    throw err;
  }
};
