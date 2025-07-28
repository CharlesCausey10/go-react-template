-- PostgreSQL Migration
-- Add user_id foreign key to posts table

-- Step 1: Add the user_id column as nullable first
ALTER TABLE posts ADD COLUMN user_id INTEGER;

-- Step 2: Set all existing posts to belong to the first user in the database
UPDATE posts 
SET user_id = (SELECT id FROM users ORDER BY id LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Make the column NOT NULL and add the foreign key constraint
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE posts ADD CONSTRAINT fk_posts_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
