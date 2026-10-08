package handlers

import (
	"errors"
	"net/http"
	"strings"

	"backend/models"
	"backend/requests"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EntityHandler struct {
	db *gorm.DB
}

func NewEntityHandler(db *gorm.DB) *EntityHandler {
	return &EntityHandler{
		db: db,
	}
}

// Create Entity
func (h *EntityHandler) Create(c *gin.Context) {
	var request requests.CreateEntityRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	entity := models.Entity{
		Name:      strings.TrimSpace(request.Name),
		Type:      request.Type,
		Status:    request.Status,
		Latitude:  *request.Latitude,
		Longitude: *request.Longitude,
	}

	if entity.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error":   "Name is required",
		})
		return
	}

	if err := h.db.Create(&entity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create entity",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Entity created successfully",
		"data":    entity,
	})
}

// Get All Entities
func (h *EntityHandler) GetAll(c *gin.Context) {
	var entities []models.Entity

	if err := h.db.Find(&entities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve entities",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Entities retrieved successfully",
		"data":    entities,
	})
}

// Update Entity
func (h *EntityHandler) Update(c *gin.Context) {
	var entity models.Entity

	if err := h.db.First(&entity, c.Param("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Entity not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve entity",
			"error":   err.Error(),
		})
		return
	}

	var request requests.UpdateEntityRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	name := strings.TrimSpace(request.Name)

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error":   "Name is required",
		})
		return
	}

	entity.Name = name
	entity.Type = request.Type
	entity.Status = request.Status
	entity.Latitude = *request.Latitude
	entity.Longitude = *request.Longitude

	if err := h.db.Save(&entity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update entity",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Entity updated successfully",
		"data":    entity,
	})
}

// Delete Entity
func (h *EntityHandler) Delete(c *gin.Context) {
	var entity models.Entity

	if err := h.db.First(&entity, c.Param("id")).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Entity not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve entity",
			"error":   err.Error(),
		})
		return
	}

	if err := h.db.Delete(&entity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete entity",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Entity deleted successfully",
	})
}
