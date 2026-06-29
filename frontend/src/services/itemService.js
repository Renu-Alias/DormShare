import api from "./api";

export const getItems = async (params) => {
  const { data } = await api.get("/items", { params });
  return data;
};

export const getMyItems = async () => {
  const { data } = await api.get("/items/myitems");
  return data;
};

export const getItemById = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

export const createItem = async (formData) => {
  const { data } = await api.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateItem = async (id, formData) => {
  const { data } = await api.put(`/items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`);
  return data;
};

export const toggleAvailability = async (id) => {
  const { data } = await api.patch(`/items/${id}/availability`);
  return data;
};
