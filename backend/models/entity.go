package models

type Entity struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	Name      string  `json:"name"`
	Type      string  `json:"type"`
	Status    string  `json:"status"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
