package main

import (
	"backend/config"
	"backend/routes"

	"log"
)

func main() {
	db, err := config.ConnectDatabase()

	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	r := routes.SetupRouter(db)

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
