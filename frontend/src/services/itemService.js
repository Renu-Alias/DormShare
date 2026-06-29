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
];

export const getItems = async (params = {}) => {
  let filtered = [...mockItems];
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }
  if (params.category) filtered = filtered.filter((i) => i.category === params.category);
  if (params.hostelBlock) filtered = filtered.filter((i) => i.hostelBlock === params.hostelBlock);
  return { items: filtered, totalPages: 1, currentPage: 1, total: filtered.length };
};

export const getMyItems = async () => {
  return mockItems;
};

export const getItemById = async (id) => {
  return mockItems.find((i) => i._id === id) || null;
};

export const createItem = async (formData) => {
  return { _id: Date.now().toString(), ...Object.fromEntries(formData), images: [], owner: { name: "You" } };
};

export const updateItem = async (id, formData) => {
  return { _id: id, ...Object.fromEntries(formData), message: "Updated (demo)" };
};

export const deleteItem = async (id) => {
  return { message: "Item removed (demo)" };
};

export const toggleAvailability = async (id) => {
  return { _id: id, message: "Availability toggled (demo)" };
};
