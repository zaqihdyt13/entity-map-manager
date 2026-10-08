package requests

type CreateEntityRequest struct {
	Name      string   `json:"name" binding:"required,max=100"`
	Type      string   `json:"type" binding:"required,oneof=vehicle iot_device facility"`
	Status    string   `json:"status" binding:"required,oneof=active inactive"`
	Latitude  *float64 `json:"latitude" binding:"required,gte=-90,lte=90"`
	Longitude *float64 `json:"longitude" binding:"required,gte=-180,lte=180"`
}

type UpdateEntityRequest struct {
	Name      string   `json:"name" binding:"required,max=100"`
	Type      string   `json:"type" binding:"required,oneof=vehicle iot_device facility"`
	Status    string   `json:"status" binding:"required,oneof=active inactive"`
	Latitude  *float64 `json:"latitude" binding:"required,gte=-90,lte=90"`
	Longitude *float64 `json:"longitude" binding:"required,gte=-180,lte=180"`
}
