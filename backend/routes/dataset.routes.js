const express = require("express");

const router = express.Router();

const datasetController = require("../controllers/dataset.controller");

// GET /datasets                       -> list all datasets
router.get("/", datasetController.getAllDatasets);

// GET /datasets/columns?dataset=NAME  -> Columns for one dataset
router.get("/columns", datasetController.getColumns);

module.exports = router;