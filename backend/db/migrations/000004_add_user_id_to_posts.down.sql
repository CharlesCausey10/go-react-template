-- PostgreSQL Migration Rollback
-- Remove user_id foreign key from posts table

-- Step 1: Drop the foreign key constraint first
ALTER TABLE posts DROP CONSTRAINT IF EXISTS fk_posts_user_id;

-- Step 2: Drop the user_id column
ALTER TABLE posts DROP COLUMN IF EXISTS user_id;