import api from "./api";

const isNetworkError = (err) => !err.response && err.message !== "canceled";

export const borrowItem = async (itemId, expectedReturnDate) => {
  try {
    const { data } = await api.post("/leases/borrow", { itemId, expectedReturnDate });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { _id: Date.now().toString(), message: "Borrowed (offline demo)" };
    throw err;
  }
};

export const returnItem = async (id) => {
  try {
    const { data } = await api.put(`/leases/${id}/return`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Returned (offline demo)" };
    throw err;
  }
};

export const requestExtension = async (id, extensionDays) => {
  try {
    const { data } = await api.post(`/leases/${id}/request-extension`, { extensionDays });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Extension requested (offline demo)" };
    throw err;
  }
};

export const approveExtension = async (id) => {
  try {
    const { data } = await api.put(`/leases/${id}/approve-extension`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Extension approved (offline demo)" };
    throw err;
  }
};

export const rejectExtension = async (id) => {
  try {
    const { data } = await api.put(`/leases/${id}/reject-extension`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { message: "Extension rejected (offline demo)" };
    throw err;
  }
};

export const getMyLeases = async () => {
  try {
    const { data } = await api.get("/leases/myleases");
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { borrowed: [], lent: [] };
    throw err;
  }
};

export const getLeaseById = async (id) => {
  try {
    const { data } = await api.get(`/leases/${id}`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return null;
    throw err;
  }
};
