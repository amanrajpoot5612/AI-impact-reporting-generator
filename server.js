const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Routes
const impactRoutes = require("./routes/impactRoutes");
app.use("/api", impactRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Impact Reporting Generator running skjdfbhcnkvjbivu b9p8yh3 on http://localhost:${PORT}`);
});
