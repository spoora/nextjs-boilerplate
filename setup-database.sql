-- Create the satellites table
CREATE TABLE satellites (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  operator TEXT NOT NULL,
  launch_date DATE NOT NULL,
  geo_orbit_date DATE,
  inclination NUMERIC,
  orbit_type TEXT NOT NULL,
  longitude NUMERIC,
  frequency TEXT
);

-- Insert sample data
INSERT INTO satellites (name, operator, launch_date, geo_orbit_date, inclination, orbit_type, longitude, frequency) VALUES
('Intelsat 901', 'Intelsat', '2001-06-09', '2001-06-28', 0.02, 'GEO', 27.5, 'Ku/C'),
('Eutelsat 113 West A', 'Eutelsat', '2006-05-27', '2006-06-14', 0.01, 'GEO', -113.0, 'Ku/C'),
('SES-1', 'SES', '2010-04-24', '2010-05-18', 0.05, 'GEO', -101.0, 'C/Ka'),
('Astra 2G', 'SES', '2014-12-27', '2015-01-16', 0.03, 'GEO', 28.2, 'Ku/Ka'),
('Inmarsat-5 F4', 'Inmarsat', '2017-05-15', '2017-06-01', 3.0, 'GEO', -83.0, 'Ka'),
('Telstar 19 VANTAGE', 'Telesat', '2018-07-22', '2018-08-10', 0.01, 'GEO', -63.0, 'Ku/Ka'),
('JCSAT-17', 'SKY Perfect JSAT', '2020-02-18', '2020-03-12', 0.02, 'GEO', 136.0, 'C/Ku/Ka'),
('Starlink-1', 'SpaceX', '2019-05-24', NULL, 53.0, 'LEO', NULL, 'Ku/Ka'),
('OneWeb-0012', 'OneWeb', '2020-02-06', NULL, 87.9, 'LEO', NULL, 'Ku'),
('Iridium-133', 'Iridium Communications', '2018-01-14', NULL, 86.4, 'LEO', NULL, 'L/Ka');

-- Add Row Level Security (RLS) policies
ALTER TABLE satellites ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read satellites data
CREATE POLICY "Allow public read access" ON satellites
  FOR SELECT USING (true);
