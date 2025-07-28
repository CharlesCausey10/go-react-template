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
	"golang.org/x/crypto/bcrypt"
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

func (s *Server) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Username, email, and password are required", http.StatusBadRequest)
		return
	}
	// if username contains '@' or email doesn't contain '@' throw error
	if strings.Contains(req.Username, "@") {
		http.Error(w, "Username cannot contain '@'", http.StatusBadRequest)
		return
	}
	if !strings.Contains(req.Email, "@") {
		http.Error(w, "Email must contain '@'", http.StatusBadRequest)
		return
	}

	hashed, err := auth.HashPassword(req.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	user, err := s.db.CreateUser(r.Context(), db.CreateUserParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashed,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(struct {
		ID       int32  `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
	}{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	})
}

func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UsernameOrEmail string `json:"usernameOrEmail"`
		Password        string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := s.db.GetUserByUsernameOrEmail(r.Context(), req.UsernameOrEmail)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if err := auth.CheckPasswordHash(req.Password, user.PasswordHash); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateJWT(user.Username)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(struct {
		Token string `json:"token"`
	}{
		Token: token,
	})
}

func (s *Server) HandleRequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	user, err := s.db.GetUserByEmail(r.Context(), input.Email)
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

	mailer.SendResetEmail(input.Email, resetToken.Token)

	w.WriteHeader(http.StatusOK)
}

func (s *Server) HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	tokenRow, err := s.db.GetPasswordResetToken(r.Context(), input.Token)
	if err != nil || time.Now().After(tokenRow.ExpiresAt.Time) {
		http.Error(w, "Invalid or expired token", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	_, err = s.db.UpdateUserPassword(r.Context(), db.UpdateUserPasswordParams{
		ID:           tokenRow.UserID,
		PasswordHash: string(hashedPassword),
	})
	if err != nil {
		http.Error(w, "Failed to update password", http.StatusInternalServerError)
		return
	}

	_ = s.db.DeletePasswordResetToken(r.Context(), input.Token)

	w.WriteHeader(http.StatusOK)
}
