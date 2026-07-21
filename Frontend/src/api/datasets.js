import apiRequest from "./client";

export const getDatasets = () => apiRequest("/datasets");
