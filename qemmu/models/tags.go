package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Tags struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Name      string    `json:"name"`
	OrgId     string    `json:"org_id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
