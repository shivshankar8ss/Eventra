const app = require("./app");
require("./workers/seatExpiry.worker");
require("dotenv").config();
require("./workers/email.worker");
const connectMongo = require("./config/mongo");
const PORT = process.env.port ||5000;
connectMongo();
app.listen(PORT,()=>{
    console.log(`Eventra API running on port ${PORT}`)
})