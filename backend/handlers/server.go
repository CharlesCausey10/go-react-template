package handlers

import (
	"database/sql"

	db "github.com/charlescausey10/go-react-template/backend/generated"
)

type Server struct {
	db     *db.Queries
	dbConn *sql.DB
}

func NewServer(conn *sql.DB) *Server {
	return &Server{
		db:     db.New(conn),
		dbConn: conn,
	}
}
