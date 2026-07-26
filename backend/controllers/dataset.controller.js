const datasetService = require("../services/dataset.service");

const getAllDatasets = async (req, res, next) => {
  try {
    const datasets = await datasetService.getAllDatasets();
    return res.status(200).json({
      success: true,
      count: datasets.length,
      data: datasets,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

// GET /datasets/columns?dataset=Equity Trades
const getColumns = async (req, res, next) => {
  try {
    const { dataset } = req.query;

    if (!dataset) {
      return res.status(400).json({
        success: false,
        message: "Query param 'dataset' is required, e.g. /datasets/columns?dataset=Equity Trades",
      });
    }

    const columns = await datasetService.getColumnsByDatasetName(dataset);

    return res.status(200).json({
      success: true,
      count: columns.length,
      data: columns,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDatasets,
  getColumns,
};