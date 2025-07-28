package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	db "github.com/charlescausey10/go-react-template/backend/generated"
	"github.com/charlescausey10/go-react-template/backend/handlers"
	"github.com/charlescausey10/go-react-template/backend/mailer"
	"github.com/charlescausey10/go-react-template/backend/routes"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// type Server struct {
// 	db *db.Queries
// }

func main() {
	env := os.Getenv("GO_ENV")
	if env == "" {
		env = "development"
	}
	godotenv.Load(".env." + env)

	conn, err := sql.Open("postgres", "postgres://dev:devpass@127.0.0.1:5432/mydb?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	server := handlers.NewServer(db.New(conn))

	r := chi.NewRouter()

	// Configure CORS middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",
			"https://MY_PROJECT_NAME.com", // todo: replace with your public domain
			"https://www.MY_PROJECT_NAME.com",
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // 5 minutes
	}))

	r.Get(routes.Posts, server.HandleGetPosts)
	r.Post(routes.Posts, server.HandleCreatePost)
	r.Post(routes.Register, server.HandleRegister)
	r.Post(routes.Login, server.HandleLogin)
	r.Post(routes.RequestPasswordReset, server.HandleRequestPasswordReset)
	r.Post(routes.ResetPassword, server.HandleResetPassword)
	r.Get(routes.Me, server.AuthMiddleware(server.HandleMe))

	_ = godotenv.Load()
	mailer.InitMailer()

	log.Println("Listening on " + os.Getenv("BACKEND_BASE_URL"))
	http.ListenAndServe(":8080", r)
}
