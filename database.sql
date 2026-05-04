CREATE DATABASE IF NOT EXISTS ai_impact;
USE ai_impact;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(150),
  description TEXT
);

CREATE TABLE IF NOT EXISTS impact_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNIQUE,
  plastic_saved_grams INT,
  carbon_avoided_grams INT,
  local_sourcing_summary VARCHAR(255),
  impact_statement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_impact_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
);

INSERT INTO products (id, product_name, description)
SELECT
  n.id,
  CONCAT(
    CASE MOD(n.id, 15)
      WHEN 1 THEN 'Reusable Steel Water Bottle'
      WHEN 2 THEN 'Compostable Food Container'
      WHEN 3 THEN 'Solar Desk Lamp'
      WHEN 4 THEN 'Bamboo Toothbrush Set'
      WHEN 5 THEN 'Recycled Cotton Tote Bag'
      WHEN 6 THEN 'Compostable Mailer Pack'
      WHEN 7 THEN 'Electric Delivery Scooter'
      WHEN 8 THEN 'Local Refill Shampoo Bottle'
      WHEN 9 THEN 'Solar Power Bank'
      WHEN 10 THEN 'Plant-Based Lunch Box'
      WHEN 11 THEN 'Recycled Paper Notebook'
      WHEN 12 THEN 'Reusable Coffee Cup'
      WHEN 13 THEN 'Organic Cotton T-Shirt'
      WHEN 14 THEN 'Biodegradable Cleaning Kit'
      ELSE 'Refillable Home Care Bottle'
    END,
    ' #',
    n.id
  ) AS product_name,
  CASE MOD(n.id, 15)
    WHEN 1 THEN 'Plastic-free reusable bottle made in India with durable stainless steel.'
    WHEN 2 THEN 'Compostable local packaging for food delivery with reduced plastic use.'
    WHEN 3 THEN 'Solar powered rechargeable lamp using renewable energy for everyday workspaces.'
    WHEN 4 THEN 'Plastic-free reusable bamboo toothbrush set from a local supplier.'
    WHEN 5 THEN 'Reusable cotton shopping bag made in India with recycled textile material.'
    WHEN 6 THEN 'Compostable plastic-free shipping mailer for e-commerce orders.'
    WHEN 7 THEN 'Electric last-mile delivery scooter powered by renewable charging stations.'
    WHEN 8 THEN 'Reusable refill shampoo bottle with plastic-free packaging and local sourcing.'
    WHEN 9 THEN 'Solar rechargeable power bank using renewable energy for mobile devices.'
    WHEN 10 THEN 'Reusable compostable lunch box made from plant-based material.'
    WHEN 11 THEN 'Notebook made with recycled paper and local printing partners.'
    WHEN 12 THEN 'Reusable coffee cup that replaces disposable plastic-lined takeaway cups.'
    WHEN 13 THEN 'Organic cotton t-shirt made in India with local textile sourcing.'
    WHEN 14 THEN 'Biodegradable cleaning kit with compostable plastic-free packaging.'
    ELSE 'Refillable reusable home care bottle designed for low-waste local refills.'
  END AS description
FROM (
  SELECT tens.n * 10 + ones.n + 1 AS id
  FROM (
    SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
  ) tens
  CROSS JOIN (
    SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
  ) ones
) n
WHERE n.id BETWEEN 1 AND 150
ON DUPLICATE KEY UPDATE
  product_name = VALUES(product_name),
  description = VALUES(description);

INSERT INTO impact_reports (
  product_id,
  plastic_saved_grams,
  carbon_avoided_grams,
  local_sourcing_summary,
  impact_statement
)
SELECT
  m.product_id,
  m.plastic_saved_grams,
  m.carbon_avoided_grams,
  m.local_sourcing_summary,
  CONCAT(
    'By choosing this product, approximately ',
    m.plastic_saved_grams,
    'g of plastic waste and ',
    m.carbon_avoided_grams,
    'g of carbon emissions were avoided.'
  ) AS impact_statement
FROM (
  SELECT
    n.id AS product_id,
    120 + (MOD(n.id * 37, 520)) AS plastic_saved_grams,
    90 + (MOD(n.id * 43, 620)) AS carbon_avoided_grams,
    CASE MOD(n.id, 5)
      WHEN 1 THEN 'Locally sourced with reduced transport emissions'
      WHEN 2 THEN 'Compostable material with reduced packaging impact'
      WHEN 3 THEN 'Renewable energy benefit with standard sourcing'
      WHEN 4 THEN 'Made in India with local supplier support'
      ELSE 'Reusable refill model with reduced waste impact'
    END AS local_sourcing_summary
  FROM (
    SELECT tens.n * 10 + ones.n + 1 AS id
    FROM (
      SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
      UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
    ) tens
    CROSS JOIN (
      SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) ones
  ) n
  WHERE n.id BETWEEN 1 AND 150
) m
ON DUPLICATE KEY UPDATE
  plastic_saved_grams = VALUES(plastic_saved_grams),
  carbon_avoided_grams = VALUES(carbon_avoided_grams),
  local_sourcing_summary = VALUES(local_sourcing_summary),
  impact_statement = VALUES(impact_statement);
