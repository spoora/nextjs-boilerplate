-- Check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS "Geosatable" (
  id SERIAL PRIMARY KEY,
  "Satellite Name" TEXT NOT NULL,
  "Satellite Operator" TEXT NOT NULL,
  "Launch date Date" DATE,
  "Geo orbit Reach Date" DATE,
  "Status Date" DATE,
  "Inclination" NUMERIC,
  "Orbit Type" TEXT,
  "Longitude" NUMERIC,
  "Commercial Telecom" TEXT,
  "Ku Frequency (Yes/No)" TEXT,
  "C Frequency (Yes/No)" TEXT,
  "Ka Frequency (Yes/No)" TEXT,
  "JCAT" TEXT,
  "Piece" TEXT
);

-- Insert sample data only if the table is empty
INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Geo orbit Reach Date", 
  "Orbit Type", 
  "Longitude", 
  "Inclination",
  "Ku Frequency (Yes/No)",
  "C Frequency (Yes/No)",
  "Ka Frequency (Yes/No)"
)
SELECT 
  'Intelsat 901', 'Intelsat', '2001-06-09', '2001-06-28', 'GEO', 27.5, 0.02, 'Yes', 'Yes', 'No'
WHERE NOT EXISTS (SELECT 1 FROM "Geosatable" LIMIT 1);

INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Geo orbit Reach Date", 
  "Orbit Type", 
  "Longitude", 
  "Inclination",
  "Ku Frequency (Yes/No)",
  "C Frequency (Yes/No)",
  "Ka Frequency (Yes/No)"
)
SELECT 
  'Eutelsat 113 West A', 'Eutelsat', '2006-05-27', '2006-06-14', 'GEO', -113.0, 0.01, 'Yes', 'Yes', 'No'
WHERE EXISTS (SELECT 1 FROM "Geosatable" HAVING COUNT(*) < 2);

INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Geo orbit Reach Date", 
  "Orbit Type", 
  "Longitude", 
  "Inclination",
  "Ku Frequency (Yes/No)",
  "C Frequency (Yes/No)",
  "Ka Frequency (Yes/No)"
)
SELECT 
  'SES-1', 'SES', '2010-04-24', '2010-05-18', 'GEO', -101.0, 0.05, 'No', 'Yes', 'Yes'
WHERE EXISTS (SELECT 1 FROM "Geosatable" HAVING COUNT(*) < 3);

-- Add some LEO satellites for orbit type filtering
INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Orbit Type", 
  "Inclination",
  "Ku Frequency (Yes/No)",
  "Ka Frequency (Yes/No)"
)
SELECT 
  'Starlink-1', 'SpaceX', '2019-05-24', 'LEO', 53.0, 'Yes', 'Yes'
WHERE EXISTS (SELECT 1 FROM "Geosatable" HAVING COUNT(*) < 4);

INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Orbit Type", 
  "Inclination",
  "Ku Frequency (Yes/No)"
)
SELECT 
  'OneWeb-0012', 'OneWeb', '2020-02-06', 'LEO', 87.9, 'Yes'
WHERE EXISTS (SELECT 1 FROM "Geosatable" HAVING COUNT(*) < 5);

-- Add an MEO satellite
INSERT INTO "Geosatable" (
  "Satellite Name", 
  "Satellite Operator", 
  "Launch date Date", 
  "Orbit Type", 
  "Inclination",
  "C Frequency (Yes/No)"
)
SELECT 
  'O3b mPOWER', 'SES', '2021-12-18', 'MEO', 0.0, 'Yes'
WHERE EXISTS (SELECT 1 FROM "Geosatable" HAVING COUNT(*) < 6);
