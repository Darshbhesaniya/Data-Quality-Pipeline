const express = require("express");
const ruleController = require("../controllers/rule.controller");

const router = express.Router();

//GET Method    /rules
router.get("/", ruleController.getAllRules);

// Post Method   /rules
router.post("/",ruleController.createRule);

// Put Method   /rules:id
router.put("/:id",ruleController.updateRule);

// Delete Method /rules:id
router.delete("/:id",ruleController.deleteRule);

module.exports = router;