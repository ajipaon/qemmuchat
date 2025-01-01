package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Role string

const (
	Admin Role = "ROLE_ADMIN"
	User  Role = "ROLE_USER"
)

type UserStatus string

const (
	Active    UserStatus = "ACTIVE"
	Inactive  UserStatus = "INACTIVE"
	Suspended UserStatus = "SUSPEND"
)

type Users struct {
	ID         uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()"`
	Name       string     `json:"name"`
	Email      string     `json:"email" gorm:"unique"`
	Password   string     `json:"password"`
	Image      string     `json:"image" gorm:"default:https://example.com/default-image.png"`
	Otp        string     `json:"otp" gorm:"default:0"`
	FirstLogin bool       `json:"fistLogin" gorm:"default:true"`
	Role       Role       `json:"role" gorm:"default:ROLE_USER"`
	Status     UserStatus `json:"status" gorm:"default:ACTIVE"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}

type RegisterUserRequest struct {
	Name     string `validate:"required"`
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=6"`
}
