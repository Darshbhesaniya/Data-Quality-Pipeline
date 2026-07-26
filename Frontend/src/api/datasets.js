import apiRequest from "./client";

export const getDatasets = async () => {
  const response = await apiRequest("/dataset");
  return response.data; // [{id, name}, ...]
};

export const getDatasetColumns = async (datasetName) => {
  const response = await apiRequest(
    `/dataset/columns?dataset=${encodeURIComponent(datasetName)}`
  );
  return response.data.map((row) => row.column_name); // ["trade_id", "price", ...]
};