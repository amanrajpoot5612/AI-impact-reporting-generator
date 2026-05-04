function generateImpact(product) {
  const text = `${product.product_name || ""} ${product.description || ""}`.toLowerCase();

  let plasticSaved = 0;
  let carbonAvoided = 0;
  let localSummary = "Standard sourcing";
  let confidence = 0;

  // Plastic logic
  if (text.includes("plastic") || text.includes("plastic-free") || text.includes("plastic free")) {
    plasticSaved += 200;
    confidence += 30;
  }
  if (text.includes("reusable") || text.includes("compostable")) {
    plasticSaved += 250;
    confidence += 10;
  }

  // Carbon logic
  if (plasticSaved > 0) {
    carbonAvoided += Math.round(plasticSaved * 0.65);
    confidence += 30;
  }
  if (text.includes("solar") || text.includes("electric") || text.includes("renewable")) {
    carbonAvoided += 150;
    confidence += 10;
  }

  // Local sourcing logic
  if (text.includes("local") || text.includes("made in india")) {
    localSummary = "Locally sourced with reduced transport emissions";
    carbonAvoided += 50;
    confidence += 20;
  }

  confidence = Math.min(confidence, 100);

  let confidenceLabel = "Low";
  if (confidence >= 80) confidenceLabel = "High";
  else if (confidence >= 50) confidenceLabel = "Medium";

  const impactStatement =
    `By choosing this product, approximately ${plasticSaved}g of plastic waste ` +
    `and ${carbonAvoided}g of carbon emissions were avoided.`;

  return {
    plastic_saved_grams: plasticSaved,
    carbon_avoided_grams: carbonAvoided,
    local_sourcing_summary: localSummary,
    confidence_score: confidence,
    confidence_label: confidenceLabel,
    impact_statement: impactStatement
  };
}

module.exports = { generateImpact };
