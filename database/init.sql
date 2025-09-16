Begin;

CREATE TABLE IF NOT EXISTS memberships ( --create table if it does not exist
  id SERIAL PRIMARY KEY, -- Counts from 0 for membership unique ID
  name VARCHAR(100) NOT NULL, -- Name of membership
  email VARCHAR(255) UNIQUE NOT NULL, -- Makes the emails unique
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Date of creation
);

CREATE TABLE IF NOT EXISTS deals ( --create table if it does not exist
  id SERIAL PRIMARY KEY, -- Counts from 0 for membership unique ID
  membership_id INTEGER NOT NULL --checks for integer
    REFERENCES memberships(id) --references back to the membership table ID's
    ON DELETE CASCADE, --autodelete if membershio is deleted
  description TEXT, -- desciption in text format
  amount NUMERIC(10,2) DEFAULT 0, --decimals for money
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Date of creation
);

CREATE INDEX IF NOT EXISTS idx_deals_membership_id ON deals(membership_id); --makes an index to search fater

COMMIT; 