const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventra",
  password: "1206",   // REAL password
  port: 5432,
});

module.exports = pool;
