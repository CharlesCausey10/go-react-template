package handlers

import (
	"encoding/json"
	"net/http"

	db "github.com/charlescausey10/go-react-template/backend/generated"
)

type createPostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (s *Server) HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	var req createPostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", 400)
		return
	}
	post, err := s.db.CreatePost(r.Context(), db.CreatePostParams{
		Title:   req.Title,
		Content: req.Content,
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(post)
}

func (s *Server) HandleGetPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := s.db.GetPostsWithUsername(r.Context())
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(posts)
}
