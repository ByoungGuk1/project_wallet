import { fetchClient } from "./fetchClient";

export const getCategories = () => fetchClient.get("/categories");
export const createCategory = (data) => fetchClient.post("/categories", data);
export const updateCategory = (categoryId, data) =>
  fetchClient.patch(`/categories/${categoryId}`, data);
export const deleteCategory = (categoryId) =>
  fetchClient.delete(`/categories/${categoryId}`);
