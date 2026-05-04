const db = require("../config/db");
const { generateImpact: calculateImpact } = require("../services/impactService");

const demoProductTemplates = [
  {
    name: "Reusable Steel Water Bottle",
    description: "Plastic-free reusable bottle made in India with durable stainless steel."
  },
  {
    name: "Compostable Food Container",
    description: "Compostable local packaging for food delivery with reduced plastic use."
  },
  {
    name: "Solar Desk Lamp",
    description: "Solar powered rechargeable lamp using renewable energy for everyday workspaces."
  },
  {
    name: "Bamboo Toothbrush Set",
    description: "Plastic-free reusable bamboo toothbrush set from a local supplier."
  },
  {
    name: "Recycled Cotton Tote Bag",
    description: "Reusable cotton shopping bag made in India with recycled textile material."
  },
  {
    name: "Compostable Mailer Pack",
    description: "Compostable plastic-free shipping mailer for e-commerce orders."
  },
  {
    name: "Electric Delivery Scooter",
    description: "Electric last-mile delivery scooter powered by renewable charging stations."
  },
  {
    name: "Local Refill Shampoo Bottle",
    description: "Reusable refill shampoo bottle with plastic-free packaging and local sourcing."
  },
  {
    name: "Solar Power Bank",
    description: "Solar rechargeable power bank using renewable energy for mobile devices."
  },
  {
    name: "Plant-Based Lunch Box",
    description: "Reusable compostable lunch box made from plant-based material."
  },
  {
    name: "Recycled Paper Notebook",
    description: "Notebook made with recycled paper and local printing partners."
  },
  {
    name: "Reusable Coffee Cup",
    description: "Reusable coffee cup that replaces disposable plastic-lined takeaway cups."
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Organic cotton t-shirt made in India with local textile sourcing."
  },
  {
    name: "Biodegradable Cleaning Kit",
    description: "Biodegradable cleaning kit with compostable plastic-free packaging."
  },
  {
    name: "Refillable Home Care Bottle",
    description: "Refillable reusable home care bottle designed for low-waste local refills."
  }
];

const demoProducts = Object.fromEntries(
  Array.from({ length: 150 }, (_, index) => {
    const id = index + 1;
    const template = demoProductTemplates[index % demoProductTemplates.length];

    return [
      id,
      {
        id,
        product_name: `${template.name} #${id}`,
        description: template.description
      }
    ];
  })
);

function isValidProductId(productId) {
  return Number.isInteger(Number(productId)) && Number(productId) > 0;
}

function toProductResponse(product) {
  return {
    id: product.id,
    name: product.product_name,
    description: product.description || ""
  };
}

function sendGeneratedImpact(res, product, requestStartedAt) {
  const impact = {
    product_id: product.id,
    ...calculateImpact(product)
  };

  res.json({
    impact,
    product: toProductResponse(product),
    meta: {
      product_id: product.id,
      product_name: product.product_name,
      generated_at: new Date().toISOString(),
      processing_time_ms: Date.now() - requestStartedAt,
      source: "generated"
    }
  });
}

exports.getProductDetails = (req, res) => {
  const { product_id } = req.params;

  if (!isValidProductId(product_id)) {
    return res.status(400).json({ error: "A valid product ID is required" });
  }

  const sql = `
    SELECT id, product_name, description
    FROM products
    WHERE id = ?
  `;

  if (!db.isConnected) {
    const fallbackProduct = demoProducts[Number(product_id)];
    if (fallbackProduct) {
      return res.json({ product: toProductResponse(fallbackProduct) });
    }
    return res.status(503).json({ error: "Database is not connected" });
  }

  db.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      const fallbackProduct = demoProducts[Number(product_id)];
      if (fallbackProduct) {
        return res.json({ product: toProductResponse(fallbackProduct) });
      }
      return res.status(500).json({ error: "Database error" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "No product found for this ID" });
    }

    const product = results[0];

    res.json({
      product: {
        ...toProductResponse(product)
      }
    });
  });
};

exports.generateImpact = (req, res) => {
  const { product_id } = req.body;
  const requestStartedAt = Date.now();

  if (!isValidProductId(product_id)) {
    return res.status(400).json({ error: "A valid product ID is required" });
  }

  const sql = `
    SELECT
      p.id AS product_id,
      p.product_name,
      p.description AS product_description,
      ir.id AS report_id,
      ir.plastic_saved_grams,
      ir.carbon_avoided_grams,
      ir.local_sourcing_summary,
      ir.impact_statement,
      ir.created_at
    FROM products p
    LEFT JOIN impact_reports ir ON ir.product_id = p.id
    WHERE p.id = ?
    ORDER BY ir.created_at DESC
    LIMIT 1
  `;

  if (!db.isConnected) {
    const fallbackProduct = demoProducts[Number(product_id)];
    if (fallbackProduct) {
      return sendGeneratedImpact(res, fallbackProduct, requestStartedAt);
    }
    return res.status(503).json({ error: "Database is not connected" });
  }

  db.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      const fallbackProduct = demoProducts[Number(product_id)];
      if (fallbackProduct) {
        return sendGeneratedImpact(res, fallbackProduct, requestStartedAt);
      }
      return res.status(500).json({ error: "Database error" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "No product found for this ID" });
    }

    const row = results[0];
    const product = {
      id: row.product_id,
      product_name: row.product_name,
      description: row.product_description || ""
    };

    const generatedImpact = calculateImpact(product);
    const storedImpact = row.report_id
      ? {
          id: row.report_id,
          product_id: row.product_id,
          plastic_saved_grams: row.plastic_saved_grams,
          carbon_avoided_grams: row.carbon_avoided_grams,
          local_sourcing_summary: row.local_sourcing_summary,
          impact_statement: row.impact_statement,
          created_at: row.created_at
        }
      : {};

    const impact = {
      product_id: row.product_id,
      ...generatedImpact,
      ...storedImpact
    };

    res.json({
      impact,
      product: {
        id: row.product_id,
        name: row.product_name || `Product #${row.product_id}`,
        description: row.product_description || ""
      },
      meta: {
        product_id: row.product_id,
        product_name: row.product_name || `Product #${row.product_id}`,
        generated_at: new Date().toISOString(),
        processing_time_ms: Date.now() - requestStartedAt,
        source: row.report_id ? "database" : "generated"
      }
    });
  });
};
