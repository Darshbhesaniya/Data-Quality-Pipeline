const db = require("../config/db");
const AppError = require("../utils/AppError");

const getAllRules = async () => {

    const query = "SELECT * FROM validation_rules";

    const [rows] = await db.query(query);

    return rows;
};


const createRule = async (ruleData) => {
    const query = `INSERT INTO validation_rules(
    rule_name,
    dataset,
    column_name,
    operator,
    rule_value,
    error_message,
    is_active   
    )
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        ruleData.rule_name,
        ruleData.dataset,
        ruleData.column_name,
        ruleData.operator,
        ruleData.rule_value,
        ruleData.error_message,
        ruleData.is_active
    ];

    const [result] = await db.query(query, values);

    return {
        id: result.insertId,
        ...ruleData
    };

};


const updateRule = async (id, ruleData) => {
    const query = `
        UPDATE validation_rules
        SET
            rule_name = ?,
            dataset = ?,
            column_name = ?,
            operator = ?,
            rule_value = ?,
            error_message = ?,
            is_active = ?
        WHERE id = ?
    `;

    const values = [
        ruleData.rule_name,
        ruleData.dataset,
        ruleData.column_name,
        ruleData.operator,
        ruleData.rule_value,
        ruleData.error_message,
        ruleData.is_active,
        id
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
        throw new AppError(
            "Rule Not Found",
            404
        );
    }

    return {
        id,
        ...ruleData
    };

};

const deleteRule = async (id) => {
    const query = `
        DELETE FROM validation_rules
        WHERE id = ?
    `;

    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
        throw new AppError(
            "Rule Not Found",
            404
        );
    }

    return {
        id
    };

};

module.exports = {
    getAllRules,
    createRule,
    updateRule,
    deleteRule
};