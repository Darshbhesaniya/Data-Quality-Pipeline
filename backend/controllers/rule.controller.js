const ruleService = require("../services/rule.service");

const getAllRules = async (req, res,next) => {
    try {

        const rules = await ruleService.getAllRules();

        return res.status(200).json({
            success: true,
            count: rules.length,
            data: rules,
        });

    } catch (error) {

    next(error);
        // return res.status(500).json({
        //     success: false,
        //     message: "Failed to fetch rules",
        //     error: error.message,
        // });

    }

};


const createRule = async(req,res,next) => {
    try {
        const newRule = await ruleService.createRule(req.body);

        return res.status(200).json({
            success: true,
            message: "Rule Created Successfully",
            data: newRule
        })
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })
    }    
}

const updateRule = async(req,res,next) => {
    try {
        const id = req.params.id;

        const ruleData = req.body;

        const updateRule = await ruleService.updateRule(id, ruleData);

         return res.status(200).json({
            success: true,
            message: "Rule Updated Successfully",
            data: updateRule
        })
    } catch (error) {

         next(error);
        // if(error.message === "Rule Not Found"){
        //     return res.status(404).json({
        //         success: false,
        //         message: error.message
        //     });
        // }

        //  return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })
    }
}

const deleteRule = async(req,res) => {

    try {
        const id = req.params.id

        await ruleService.deleteRule(id);

        return res.status(200).json({
            success: true,
            message: "Rule Deleted Successfully"
        });
    } catch (error) {
        console.log(error.message);
        if(error.message === "Rule Not Found"){
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

module.exports = {
    getAllRules,
    createRule,
    updateRule,
    deleteRule
};