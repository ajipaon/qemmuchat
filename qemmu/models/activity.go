package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Activity struct {
	gorm.Model
	UserID              uuid.UUID `json:"user_id"`
	LatCurrentActivity  time.Time `json:"last_current_activity"`
	LastActivityNetwork time.Time `json:"last_activity_network"`
	LastActivityApp     time.Time `json:"last_activity_app"`
}

type ActivityResponse struct {
	ID                  int         `json:"id"`
	CreatedAt           time.Time   `json:"CreatedAt"`
	UpdatedAt           time.Time   `json:"UpdatedAt"`
	DeletedAt           interface{} `json:"DeletedAt"`
	UserId              uuid.UUID   `json:"user_id"`
	LastCurrentActivity time.Time   `json:"last_current_activity"`
	LastActivityNetwork time.Time   `json:"last_activity_network"`
	LastActivityApp     time.Time   `json:"last_activity_app"`
}
