-- Step 1: Add the email column (nullable at first)
ALTER TABLE users ADD COLUMN email TEXT;

-- Step 2: TEMPORARILY fill in placeholder emails for existing users
UPDATE users SET email = CONCAT(username, '@placeholder.local') WHERE email IS NULL;

-- Step 3: Enforce NOT NULL and UNIQUE
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);