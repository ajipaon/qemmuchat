package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role string

const (
	RoleSuperAdmin Role = "ROLE_SUPER_ADMIN"
	RoleAdmin      Role = "ROLE_ADMIN"
	RoleUser       Role = "ROLE_USER"
)

type UserStatus string

const (
	Active    UserStatus = "ACTIVE"
	Inactive  UserStatus = "INACTIVE"
	Suspended UserStatus = "SUSPEND"
)

type User struct {
	ID               uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4()"`
	Name             string     `json:"name"`
	Email            string     `json:"email" gorm:"unique"`
	Password         string     `json:"password"`
	Image            string     `json:"image" gorm:"default:https://example.com/default-image.png"`
	Otp              string     `json:"otp" gorm:"default:0"`
	FirstLogin       bool       `json:"first_login" gorm:"default:true"`
	Role             Role       `json:"role" gorm:"default:ROLE_USER"`
	Status           UserStatus `json:"status" gorm:"default:ACTIVE"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt  `gorm:"index"`
	Organizations    []*Organization `gorm:"many2many:user_organizations"`
	LastOrganization string          `json:"last_organization" gorm:"default:null"`
	Activity         Activity        `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"activity"`
}

type RegisterUserRequest struct {
	Name     string `validate:"required"`
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=6"`
}

type LoginUserRequest struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=6"`
}

type UserResponse struct {
	Name             string           `json:"name"`
	Email            string           `json:"email"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
	Image            string           `json:"image"`
	FirstLogin       bool             `json:"firstlogin"`
	Status           string           `json:"status"`
	Role             string           `json:"role"`
	LastOrganization string           `json:"last_organization"`
	Organizations    []*Organization  `json:"user_organizations"`
	Activity         ActivityResponse `json:"activity"`
}
