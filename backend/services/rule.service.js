const ruleModel = require("../models/rule.model");
const AppError = require("../utils/AppError");


// This validateRule for simple validation and use at in createRule and updateRule
const validateRule = (ruleData) => {

    const requiredFields = [
        "rule_name",
        "dataset",
        "column_name",
        "operator",
        "rule_value",
        "error_message"
    ];

    for (const field of requiredFields) {

        if (!ruleData[field]) {
            throw new AppError(
                `${field} is required`,
                400
            );
        }

    }

};


const getAllRules = async () => {

    const rules = await ruleModel.getAllRules();

    return rules;
};

const createRule = async (ruleData) => {

    validateRule(ruleData);

    return await ruleModel.createRule(ruleData);

};

const updateRule = async (id, ruleData) => {

    validateRule(ruleData);

    return await ruleModel.updateRule(id, ruleData);

};


const deleteRule = async (id) => {
    return await ruleModel.deleteRule(id);
};

module.exports = {
    getAllRules,
    createRule,
    updateRule,
    deleteRule
};