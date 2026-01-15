const app = require("./app");
require("dotenv").config();
const connectMongo = require("./config/mongo");
const PORT = process.env.port ||5000;
connectMongo();
app.listen(PORT,()=>{
    console.log(`Eventra API running on port ${PORT}`)
})