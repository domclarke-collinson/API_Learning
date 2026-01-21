Begin;

CREATE TABLE IF NOT EXISTS memberships ( 
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
);

CREATE TABLE IF NOT EXISTS deals ( 
  id SERIAL PRIMARY KEY, 
  membership_id INTEGER NOT NULL 
    REFERENCES memberships(id) 
    ON DELETE CASCADE, 
  description TEXT, 
  amount NUMERIC(10,2) DEFAULT 0, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
);

CREATE INDEX IF NOT EXISTS idx_deals_membership_id ON deals(membership_id);

COMMIT; 