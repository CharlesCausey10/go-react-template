migrate create -ext sql -dir db/migrations -seq MIGRATION_NAME

migrate -path db/migrations -database "postgres://dev:devpass@localhost:5432/mydb?sslmode=disable" up

sqlc generate -f db/sqlc.yaml