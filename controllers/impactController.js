const db = require("../config/db");

exports.generateImpact = (req, res) => {
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  setTimeout(() => {
    const sql = "SELECT * FROM impact_reports WHERE product_id = ?";

    db.query(sql, [product_id], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No impact data found" });
      }

      const impact = results[0];

      // 🧠 Confidence logic
      let confidenceScore = 70;

      if (impact.plastic_saved_grams > 300) confidenceScore += 10;
      if (impact.carbon_avoided_grams > 200) confidenceScore += 10;

      let confidenceLabel = "Moderate";

      if (confidenceScore >= 90) confidenceLabel = "High";
      else if (confidenceScore >= 80) confidenceLabel = "Strong";
      else if (confidenceScore >= 70) confidenceLabel = "Good";

      res.json({
        impact: {
          ...impact,
          confidence_score: confidenceScore,
          confidence_label: confidenceLabel
        }
      });
    });
  }, 2500);
};