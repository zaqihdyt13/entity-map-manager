package config

import (
	"fmt"

	"backend/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func ConnectDatabase() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&models.Entity{}); err != nil {
		return nil, err
	}

	fmt.Println("Database connected and migrated successfully!")

	return db, nil
}
