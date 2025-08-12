-- Enable pgcrypto extension for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table with only hashed password stored
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) DEFAULT 'Unknown',
    model VARCHAR(50) DEFAULT 'Unknown',
    year INTEGER,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to hash password before insert or update
CREATE OR REPLACE FUNCTION hash_password_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- If NEW.password_hash is not already hashed (naive check)
  IF NEW.password_hash IS NOT NULL AND LEFT(NEW.password_hash, 4) <> '$2a$' THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for hashing password before insert
CREATE TRIGGER trg_hash_password_before_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password_trigger();

-- Trigger for hashing password before update
CREATE TRIGGER trg_hash_password_before_update
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password_trigger();

-- Insert admin user with plain password (it will be hashed by trigger)
INSERT INTO users (name, email, password_hash)
VALUES ('Admin', 'admin@example.com', 'admin123');

-- Insert example user
INSERT INTO users (name, email, password_hash)
VALUES 
('Yaroslav', 'yaroslav.popov@example.com', 'password123'),
('Sophia Green', 'sophia.green@example.com', 'sophiaPass'),
('Liam Brown', 'liam.brown@example.com', 'liamSecret'),
('Olivia White', 'olivia.white@example.com', 'oliviaPwd'),
('Noah Black', 'noah.black@example.com', 'noahPassword');

-- Insert vehicles
INSERT INTO vehicles (make, model, year, user_id)
VALUES
('Toyota', 'Camry', 2020, 1),
('Honda', 'Civic', 2018, 2),
('Ford', 'F-150', 2019, 3),
('Tesla', 'Model 3', 2022, 4),
('Chevrolet', 'Impala', 2015, 5),
('BMW', 'X5', 2021, 2),
('Audi', 'A4', 2017, 3),
('Mercedes-Benz', 'C-Class', 2020, 1),
('Subaru', 'Outback', 2016, 4),
('Volkswagen', 'Golf', 2019, 5);