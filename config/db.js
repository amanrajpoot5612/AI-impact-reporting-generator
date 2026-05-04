require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_impact",
  charset: "utf8mb4"
});

db.isConnected = false;

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    db.isConnected = true;
    console.log("Impact DB connected");
  }
});

module.exports = db;
