const db = require("../config/db");

const getAllDatasets = async () => {
  const query = "SELECT * FROM datasets ORDER BY name";
  const [rows] = await db.query(query);
  return rows;
};

// Get columns for a dataset by its NAME (matches how `validation_rules.dataset`
// already stores plain text names like "Equity Trades")
const getColumnsByDatasetName = async (datasetName) => {
  const query = `
    SELECT dc.id, dc.column_name
    FROM dataset_columns dc
    JOIN datasets d ON d.id = dc.dataset_id
    WHERE d.name = ?
    ORDER BY dc.column_name
  `;
  const [rows] = await db.query(query, [datasetName]);
  return rows;
};

module.exports = {
  getAllDatasets,
  getColumnsByDatasetName,
};