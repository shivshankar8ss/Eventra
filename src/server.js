const app = require("./app");
require("dotenv").config();

const PORT = process.env.port ||5000;
app.listen(PORT,()=>{
    console.log(`Eventra API running on port ${PORT}`)
})