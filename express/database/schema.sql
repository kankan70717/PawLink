-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Drop Tables and Views if they exist
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS finders;
DROP TABLE IF EXISTS lost_pets;
DROP TABLE IF EXISTS sightings;
DROP VIEW IF EXISTS last_30_days_found_pets;
CREATE TABLE owners (
	owner_id INTEGER,
	owner_name TEXT NOT NULL,
	owner_phone TEXT,
	owner_email TEXT,
	PRIMARY KEY (owner_id)
);
CREATE TABLE finders (
	finder_id INTEGER,
	finder_name TEXT NOT NULL,
	finder_phone TEXT,
	finder_email TEXT,
	PRIMARY KEY (finder_id)
);
CREATE TABLE lost_pets (
	pet_id INTEGER,
	pet_name TEXT,
	image BLOB,
	species TEXT,
	breed TEXT,
	color TEXT,
	sex TEXT CHECK (sex IN ('male', 'female', 'unknown')),
	birth_date DATE,
	description TEXT,
	status TEXT DEFAULT 'lost' CHECK (status IN ('lost', 'matched')),
	lost_date DATE DEFAULT (DATE('now')),
	found_date DATE,
	owner_id INTEGER,
	PRIMARY KEY (pet_id),
	FOREIGN KEY (owner_id) REFERENCES owners(owner_id),
	CHECK (birth_date < lost_date),
	CHECK (
		found_date IS NULL
		OR lost_date <= found_date
	)
);
CREATE TABLE sightings (
	sighting_id INTEGER,
	sighting_image BLOB,
	sighting_date DATE,
	sighting_location TEXT,
	sighting_description TEXT,
	created_at DATETIME DEFAULT (DATETIME('now')),
	lost_pet_id INTEGER,
	finder_id INTEGER,
	PRIMARY KEY (sighting_id),
	FOREIGN KEY (lost_pet_id) REFERENCES lost_pets(pet_id),
	FOREIGN KEY (finder_id) REFERENCES finders(finder_id)
);
CREATE VIEW last_30_days_found_pets AS
SELECT *
FROM lost_pets
WHERE status = 'matched'
	AND found_date >= DATE('now', '-30 days');

-- Trigger to validate date consistency in lost_pets table
CREATE TRIGGER validate_birth_lost_found_dates_insert 
BEFORE INSERT ON lost_pets 
FOR EACH ROW
WHEN NEW.birth_date IS NOT NULL
  AND NEW.lost_date IS NOT NULL
  AND NEW.found_date IS NOT NULL
  AND NOT (NEW.birth_date <= NEW.lost_date AND NEW.lost_date <= NEW.found_date)
BEGIN
    SELECT RAISE(ABORT, 'Invalid dates: Ensure birth_date <= lost_date <= found_date');
END;

CREATE TRIGGER validate_birth_lost_found_dates_update 
BEFORE UPDATE ON lost_pets 
FOR EACH ROW
WHEN NEW.birth_date IS NOT NULL
  AND NEW.lost_date IS NOT NULL
  AND NEW.found_date IS NOT NULL
  AND NOT (NEW.birth_date <= NEW.lost_date AND NEW.lost_date <= NEW.found_date)
BEGIN
    SELECT RAISE(ABORT, 'Invalid dates: Ensure birth_date <= lost_date <= found_date');
END;

CREATE INDEX index_lost_pets_status_found_date
ON lost_pets (status, found_date);