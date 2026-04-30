import { fetchClient } from "./fetchClient";

export const getAccounts = () => fetchClient.get("/accounts");
export const getAccount = (accountId) =>
  fetchClient.get(`/accounts/${accountId}`);
export const createAccount = (data) => fetchClient.post("/accounts", data);
export const updateAccount = (accountId, data) =>
  fetchClient.patch(`/accounts/${accountId}`, data);
export const deleteAccount = (accountId) =>
  fetchClient.delete(`/accounts/${accountId}`);
