-- Enable foreign key constraints in SQLite to ensure referential integrity
PRAGMA foreign_keys = ON;

-- Drop tables if they already exist to allow re-creating schema
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS finders;
DROP TABLE IF EXISTS lost_pets;
DROP TABLE IF EXISTS sightings;

-- Drop the view if it exists
DROP VIEW IF EXISTS last_30_days_found_pets;

-- ===============================
-- Owners Table
-- Stores information about pet owners
-- ===============================
CREATE TABLE owners (
    owner_id INTEGER,                -- Primary key for owners
    owner_name TEXT NOT NULL,        -- Owner's name is required
    owner_phone TEXT,                -- Owner's phone number
    owner_email TEXT,                -- Owner's email
    PRIMARY KEY (owner_id)           -- Auto-incremented unique ID
);

-- ===============================
-- Finders Table
-- Stores information about people who report sightings
-- ===============================
CREATE TABLE finders (
    finder_id INTEGER,               -- Primary key for finders
    finder_name TEXT NOT NULL,       -- Finder's name is required
    finder_phone TEXT,               -- Finder's phone number
    finder_email TEXT,               -- Finder's email
    PRIMARY KEY (finder_id)
);

-- ===============================
-- Lost Pets Table
-- Stores information about lost pets
-- ===============================
CREATE TABLE lost_pets (
    pet_id INTEGER,                  -- Primary key for pets
    pet_name TEXT,                   -- Name of the pet
    image BLOB,                      -- Pet's image stored as binary
    species TEXT,                    -- Species of the pet (dog, cat, etc.)
    breed TEXT,                       -- Pet breed
    color TEXT,                       -- Color description
    sex TEXT CHECK (sex IN ('male', 'female', 'unknown')), -- Enforce valid values for sex
    birth_date DATE,                 -- Pet's birth date
    description TEXT,                -- Additional notes
    status TEXT DEFAULT 'lost' CHECK (status IN ('lost', 'matched')), -- Enforce valid status
    lost_date DATE DEFAULT (DATE('now')),  -- Default to today if not provided
    found_date DATE,                 -- Date pet was found
    owner_id INTEGER,                -- Foreign key reference to owner
    PRIMARY KEY (pet_id),
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id), -- Ensure pets reference a valid owner
    CHECK (birth_date < lost_date),  -- Pet cannot be lost before it was born
    CHECK (found_date IS NULL OR lost_date <= found_date) -- Found date must be after lost date
);

-- ===============================
-- Sightings Table
-- Records sightings of lost pets
-- ===============================
CREATE TABLE sightings (
    sighting_id INTEGER,             -- Primary key
    sighting_image BLOB,             -- Image of the sighting
    sighting_date DATE,              -- Date of the sighting
    sighting_location TEXT,          -- Location description
    sighting_description TEXT,       -- Additional details
    created_at DATETIME DEFAULT (DATETIME('now')), -- Timestamp when the record was created
    lost_pet_id INTEGER,             -- Foreign key to lost_pet
    finder_id INTEGER,               -- Foreign key to finder
    PRIMARY KEY (sighting_id),
    FOREIGN KEY (lost_pet_id) REFERENCES lost_pets(pet_id),
    FOREIGN KEY (finder_id) REFERENCES finders(finder_id)
);

-- ===============================
-- View for recently found pets
-- Returns pets marked as 'matched' in the last 30 days
-- ===============================
CREATE VIEW last_30_days_found_pets AS
SELECT *
FROM lost_pets
WHERE status = 'matched'
    AND found_date >= DATE('now', '-30 days');

-- ===============================
-- Triggers to validate date consistency
-- Ensures birth_date <= lost_date <= found_date
-- ===============================
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

-- ===============================
-- Index to optimize queries for recently found pets
-- ===============================
CREATE INDEX index_lost_pets_status_found_date
ON lost_pets (status, found_date);
