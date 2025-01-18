package models

import "github.com/google/uuid"

type RoleOrganization string

const (
	AdminOrgRole     RoleOrganization = "ADMIN"
	ModeratorOrgRole RoleOrganization = "MODERATOR"
	RoleOrgRole      RoleOrganization = "USER"
	SpectatorOrgRole RoleOrganization = "SPECTATOR"
)

type UserOrganization struct {
	UserID         uuid.UUID        `gorm:"primaryKey"`
	OrganizationID uuid.UUID        `gorm:"primaryKey"`
	RoleOrg        RoleOrganization `json:"name"`
}

type CreateNewOrganization struct {
	Name string `validate:"required,min=6"`
}
