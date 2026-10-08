package routes

import (
	"backend/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	entityHandler := handlers.NewEntityHandler(db)

	r.GET("/api/entities", entityHandler.GetAll)
	r.POST("/api/entities", entityHandler.Create)
	r.PUT("/api/entities/:id", entityHandler.Update)
	r.DELETE("/api/entities/:id", entityHandler.Delete)

	return r
}
