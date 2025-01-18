package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ActivityPlatformName string

const (
	WebPlatform ActivityPlatformName = "WEB"
	AppPlatform ActivityPlatformName = "APP"
)

type Activity struct {
	gorm.Model
	UserID              uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	LatCurrentActivity  time.Time `json:"last_current_activity"`
	LastActivityNetwork time.Time `json:"last_activity_network"`
	LastActivityApp     time.Time `json:"last_activity_app"`
	LastActivityWeb     time.Time `json:"last_activity_web"`
	LastActivityId      string    `json:"last_activity_id"`
	LastActivityPage    string    `json:"last_activity_page" gorm:"default:DASHBOARD"`
}

type ActivityUpdateRequst struct {
	UserID              uuid.UUID
	LastActivityPage    string
	LatActivityPlatform ActivityPlatformName
	LastActivityId      string
}

type ActivityResponse struct {
	ID                  int         `json:"id"`
	CreatedAt           time.Time   `json:"CreatedAt"`
	UpdatedAt           time.Time   `json:"UpdatedAt"`
	DeletedAt           interface{} `json:"DeletedAt"`
	LastCurrentActivity time.Time   `json:"last_current_activity"`
	LastActivityNetwork time.Time   `json:"last_activity_network"`
	LastActivityApp     time.Time   `json:"last_activity_app"`
	LastActivityWeb     time.Time   `json:"last_activity_web"`
	LastActivityId      string      `json:"last_activity_id"`
	LastActivityPage    string      `json:"last_activity_page"`
}
