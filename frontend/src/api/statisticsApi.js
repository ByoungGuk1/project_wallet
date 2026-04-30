import { fetchClient } from "./fetchClient";

export const getMonthlyStatistics = () =>
  fetchClient.get("/statistics/monthly");
export const getCategoryStatistics = () =>
  fetchClient.get("/statistics/category");
export const getSummaryStatistics = () =>
  fetchClient.get("/statistics/summary");
