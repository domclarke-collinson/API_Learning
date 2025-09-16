CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY, -- Counts from 0 for membership unique ID
  name VARCHAR(100) NOT NULL, -- Name of membership
  email VARCHAR(255) UNIQUE NOT NULL, -- Makes the emails unique
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Date of creation
);

CREATE TABLE deals ( 
  id SERIAL PRIMARY KEY,
  membership_id INT REFERENCES memberships(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);