package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoleOrganization string

const (
	SuperAdminOrgRole RoleOrganization = "SUPER_ADMIN"
	AdminOrgRole      RoleOrganization = "ADMIN"
	ModeratorOrgRole  RoleOrganization = "MODERATOR"
	RoleOrgRole       RoleOrganization = "USER"
	SpectatorOrgRole  RoleOrganization = "SPECTATOR"
)

type UserOrganization struct {
	gorm.Model
	UserID         uuid.UUID        `gorm:"primaryKey"`
	OrganizationID uuid.UUID        `gorm:"primaryKey"`
	RoleOrg        RoleOrganization `json:"name"`
}

type CreateNewOrganization struct {
	Name string `validate:"required,min=6"`
}

type ChangeUserRoleOrganizationDto struct {
	UserId string           `validate:"required"`
	Role   RoleOrganization `validate:"required"`
}
