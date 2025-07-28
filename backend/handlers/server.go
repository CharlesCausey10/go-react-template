package handlers

import (
	db "github.com/charlescausey10/go-react-template/backend/generated"
)

type Server struct {
	db *db.Queries
}

func NewServer(database *db.Queries) *Server {
	return &Server{db: database}
}
