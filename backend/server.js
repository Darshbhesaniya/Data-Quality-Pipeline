const express = require("express");
require("dotenv").config();
const ruleRoutes = require("./routes/rule.routes");
const  datasetRoutes = require("./routes/dataset.routes");


const cors = require("cors")

const db = require("./config/db");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/rules", ruleRoutes);

app.use("/dataset",datasetRoutes)

const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler)

const PORT = process.env.PORT;

(async () => {

    try {

        await db.getConnection();

        console.log("✅ MySQL Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error.message);

    }

})();