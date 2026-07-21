import apiRequest from "./client";

export const getResultsSummary = () => apiRequest("/results/summary");
export const getRulePerformance = () => apiRequest("/results/rule-performance");
