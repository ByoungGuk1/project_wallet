import { fetchClient } from "./fetchClient";

export const getTransactions = () => fetchClient.get("/transactions");
export const getTransaction = (transactionId) =>
  fetchClient.get(`/transactions/${transactionId}`);
export const createTransaction = (data) =>
  fetchClient.post("/transactions", data);
export const updateTransaction = (transactionId, data) =>
  fetchClient.patch(`/transactions/${transactionId}`, data);
export const deleteTransaction = (transactionId) =>
  fetchClient.delete(`/transactions/${transactionId}`);
