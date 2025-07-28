-- queries.sql
-- name: CreateUser :one
INSERT INTO users (username, email, password_hash)
VALUES ($1, $2, $3)
RETURNING id, username, email, created_at;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsernameOrEmail :one
SELECT * FROM users WHERE email = $1 OR username = $1;

-- name: InsertPasswordResetToken :one
INSERT INTO password_reset_tokens (user_id, token, expires_at)
VALUES ($1, $2, $3)
RETURNING id, user_id, token, expires_at, created_at;

-- name: GetPasswordResetToken :one
SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW();

-- name: UpdateUserPassword :one
UPDATE users SET password_hash = $2 WHERE id = $1
RETURNING id, username, email, created_at;

-- name: DeletePasswordResetToken :exec
DELETE FROM password_reset_tokens WHERE token = $1;

-- name: GetPostsWithUsername :many
SELECT p.*, u.username FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- name: GetPost :one
SELECT * FROM posts WHERE id = $1;

-- name: CreatePost :one
INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *;

-- name: UpdatePost :one
UPDATE posts SET title = $2, content = $3 WHERE id = $1 RETURNING *;

-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1;