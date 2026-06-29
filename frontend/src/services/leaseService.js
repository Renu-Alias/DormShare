export const borrowItem = async (itemId, expectedReturnDate) => {
  return { message: "Borrow request submitted (demo)", _id: Date.now().toString() };
};

export const returnItem = async (id) => {
  return { message: "Item returned (demo)" };
};

export const requestExtension = async (id, extensionDays) => {
  return { message: "Extension requested (demo)" };
};

export const approveExtension = async (id) => {
  return { message: "Extension approved (demo)" };
};

export const rejectExtension = async (id) => {
  return { message: "Extension rejected (demo)" };
};

export const getMyLeases = async () => {
  return { borrowed: [], lent: [] };
};

export const getLeaseById = async (id) => {
  return null;
};
