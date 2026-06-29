import api from "./api";

export const borrowItem = async (itemId, expectedReturnDate) => {
  const { data } = await api.post("/leases/borrow", {
    itemId,
    expectedReturnDate,
  });
  return data;
};

export const returnItem = async (id) => {
  const { data } = await api.put(`/leases/${id}/return`);
  return data;
};

export const requestExtension = async (id, extensionDays) => {
  const { data } = await api.post(`/leases/${id}/request-extension`, {
    extensionDays,
  });
  return data;
};

export const approveExtension = async (id) => {
  const { data } = await api.put(`/leases/${id}/approve-extension`);
  return data;
};

export const rejectExtension = async (id) => {
  const { data } = await api.put(`/leases/${id}/reject-extension`);
  return data;
};

export const getMyLeases = async () => {
  const { data } = await api.get("/leases/myleases");
  return data;
};

export const getLeaseById = async (id) => {
  const { data } = await api.get(`/leases/${id}`);
  return data;
};
