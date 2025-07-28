# 🧪 Go + React + PostgreSQL Fullstack Template

A production-ready fullstack starter template designed to get your personal projects up and running in minutes, not hours. Simply fork this repository, set up your database, and start building!

## ✨ What's Included

- ✅ **Go** backend with clean architecture (using `net/http` and `chi` router)
- ✅ **React + Vite** frontend with modern tooling and hot reload
- ✅ **PostgreSQL** database with sample schema
- ✅ **sqlc** for type-safe Go database operations (no more manual SQL mapping!)
- ✅ **golang-migrate** for versioned database schema migrations
- ✅ **CORS** configured for local development
- ✅ **JSON API** with proper error handling
- ✅ **Database connection pooling** and transaction support
- ✅ **Development-ready** with sample endpoints and data models

Perfect for personal projects, side hustles, or rapid prototyping when you need a solid foundation without the configuration overhead.

---

## 🛠 Prerequisites

Make sure the following tools are installed on your machine:

- [Go](https://go.dev/doc/install) (v1.20+)
- [Node.js](https://nodejs.org/) (v18 or v20 recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (v14+)
- [`sqlc`](https://docs.sqlc.dev/en/stable/overview/install.html)
- [`golang-migrate`](https://github.com/golang-migrate/migrate#installation)

---

## 🚀 Quick Start (Fork & Go!)

The fastest way to get started is to fork this repository and follow these steps:

### 1. Fork & Clone

```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/go-react-template.git
cd go-react-template
```

### 2. Set up the PostgreSQL database

#### Option A: Using pgAdmin or `psql`

1. Create a new database named: `mydb`
2. Create a user named: `dev` with password: `devpass`
3. Grant privileges to the user:

```sql
GRANT ALL PRIVILEGES ON DATABASE mydb TO dev;
```

#### Option B: Using Docker (Recommended for Development)

```bash
# Start PostgreSQL in a container
docker run --name postgres-dev \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=devpass \
  -p 5432:5432 \
  -d postgres:15

# Or use docker-compose (if you have a docker-compose.yml)
docker-compose up -d postgres
```

### 3. Run Database Migrations

```bash
cd backend
# Install golang-migrate if you haven't already
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Run migrations to create tables
migrate -path db/migrations -database "postgres://dev:devpass@localhost:5432/mydb?sslmode=disable" up
```

### 4. Start the Backend

```bash
cd backend
go mod download
go run main.go
```

The API server will start on `http://localhost:8080`

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will start on `http://localhost:5173`

### 6. Test Everything Works

Visit `http://localhost:5173` in your browser. You should see your React app successfully communicating with the Go backend and PostgreSQL database!

---

## 📁 Project Structure

```
go-react-template/
├── backend/                 # Go API server
│   ├── main.go             # Application entry point
│   ├── go.mod              # Go dependencies
│   ├── handlers/           # HTTP request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Custom data types
│   ├── utils/              # Utility functions
│   ├── db/                 # Database related files
│   │   ├── migrations/     # SQL migration files
│   │   ├── queries.sql     # SQL queries for sqlc
│   │   ├── schema.sql      # Database schema
│   │   └── sqlc.yaml       # sqlc configuration
│   └── generated/          # Auto-generated code (don't edit!)
│       ├── db.go
│       ├── models.go
│       └── queries.sql.go
├── frontend/               # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔧 Development Workflow

### Making Database Changes

1. **Create a new migration:**
   ```bash
   cd backend
   migrate create -ext sql -dir db/migrations -seq your_migration_name
   ```

2. **Write your SQL in the generated files:**
   - `xxx_your_migration_name.up.sql` - Changes to apply
   - `xxx_your_migration_name.down.sql` - How to rollback

3. **Apply the migration:**
   ```bash
   migrate -path db/migrations -database "postgres://dev:devpass@localhost:5432/mydb?sslmode=disable" up
   ```

4. **Update your queries and regenerate code:**
   ```bash
   # Edit db/queries.sql with your new SQL queries
   sqlc generate -f db/sqlc.yaml
   ```

### Adding New API Endpoints

1. Add your SQL queries to `backend/db/queries.sql`
2. Run `sqlc generate` to create Go functions
3. Create handlers in `backend/handlers/`
4. Add routes in `backend/main.go`
5. Update frontend to call your new endpoints

### Environment Variables

For production deployment, update these connection strings:

```bash
# Backend environment variables
DATABASE_URL=postgres://user:password@host:port/dbname?sslmode=require
PORT=8080

# Frontend environment variables (in .env)
VITE_API_URL=https://your-api-domain.com
```

---

## 🚢 Deployment

### Backend Deployment Options

**Railway/Render/Heroku:**
- Point to the `backend/` directory
- Set build command: `go build -o main main.go`
- Set start command: `./main`
- Add PostgreSQL database addon

**Docker:**
```dockerfile
# Example Dockerfile for backend
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

### Frontend Deployment Options

**Vercel/Netlify:**
- Point to the `frontend/` directory
- Build command: `npm run build`
- Publish directory: `dist`

**Static hosting:**
```bash
cd frontend
npm run build
# Upload contents of dist/ folder to your hosting provider
```

---

## 🛠 Customization

### Changing the Database Schema

1. Modify `backend/db/schema.sql`
2. Create a new migration with your changes
3. Update `backend/db/queries.sql` with new queries
4. Run `sqlc generate` to update Go code

### Adding Authentication

Consider adding:
- JWT middleware for API authentication
- bcrypt for password hashing
- Session management
- User registration/login endpoints

### Adding More Features

This template provides a solid foundation for:
- REST APIs with CRUD operations
- Real-time features (WebSockets)
- File uploads
- Email notifications
- Background job processing
- API rate limiting

---

## 🤝 Contributing

Found a bug or want to improve the template? 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Learn More

- [Go Documentation](https://go.dev/doc/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [sqlc Documentation](https://docs.sqlc.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Chi Router](https://github.com/go-chi/chi)

---

## ⭐ Show Your Support

If this template helped you build something awesome, give it a star! ⭐

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

