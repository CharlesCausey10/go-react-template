package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	db "github.com/charlescausey10/go-react-template/backend/generated"
	"github.com/charlescausey10/go-react-template/backend/internal/auth"
	"github.com/charlescausey10/go-react-template/backend/mailer"
	"github.com/charlescausey10/go-react-template/backend/models"
	"github.com/google/uuid"
)

func (s *Server) AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := auth.ParseJWT(tokenStr)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}
		// Inject username into context if needed
		ctx := context.WithValue(r.Context(), "username", claims.Username)
		next(w, r.WithContext(ctx))
	}
}

func (s *Server) HandleRequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var req RequestPasswordResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	user, err := s.db.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		// Return 200 even if not found to prevent user enumeration
		w.WriteHeader(http.StatusOK)
		return
	}

	token := uuid.New().String()
	expires := time.Now().Add(1 * time.Hour)
	expiresAt := models.NullTime{
		NullTime: sql.NullTime{
			Time:  expires,
			Valid: true,
		},
	}
	resetToken, err := s.db.InsertPasswordResetToken(r.Context(), db.InsertPasswordResetTokenParams{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: expiresAt,
	})
	if err != nil {
		http.Error(w, "Error saving token", http.StatusInternalServerError)
		return
	}

	mailer.SendResetEmail(req.Email, resetToken.Token)

	w.WriteHeader(http.StatusOK)
}

func (s *Server) HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	tokenRow, err := s.db.GetPasswordResetToken(r.Context(), req.Token)
	if err != nil || time.Now().After(tokenRow.ExpiresAt.Time) {
		http.Error(w, "Invalid or expired token", http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()
	tx, err := s.dbConn.BeginTx(ctx, nil) // dbConn is the *sql.DB on Server
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	qtx := s.db.WithTx(tx)

	// Update password
	if _, err = qtx.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
		ID:           tokenRow.UserID,
		PasswordHash: string(hashedPassword),
	}); err != nil {
		_ = tx.Rollback()
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}

	// Delete (consume) the reset token
	if err = qtx.DeletePasswordResetToken(ctx, req.Token); err != nil {
		_ = tx.Rollback()
		http.Error(w, "Failed to invalidate token", http.StatusInternalServerError)
		return
	}

	if err = tx.Commit(); err != nil {
		http.Error(w, "Failed to commit changes", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// Request/Response types for auth endpoints
type RequestPasswordResetRequest struct {
	Email string `json:"email"`
}
type ResetPasswordRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}
