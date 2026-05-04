const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const impactRoutes = require("./routes/impactRoutes");
app.use("/api", impactRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "AI Impact Reporting Generator is running"
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Impact Reporting Generator running on http://localhost:${PORT}`);
});
