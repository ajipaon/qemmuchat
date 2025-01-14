package repository

import (
	"qemmuChat/qemmu/models"

	"github.com/google/uuid"

	"gorm.io/gorm"
)

type OrganizationRepository struct {
	db *gorm.DB
}

func (r *OrganizationRepository) GetAll() ([]models.Organization, error) {
	var organizaiton []models.Organization
	err := r.db.Find(&organizaiton).Error
	return organizaiton, err
}

func (r *OrganizationRepository) GetOrganization(id string) (*models.Organization, error) {
	var organizaiton models.Organization
	err := r.db.First(&organizaiton, id).Error
	return &organizaiton, err
}

func (r *OrganizationRepository) AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) error {
	return r.db.Create(&models.UserOrganization{
		UserID:         userId,
		OrganizationID: organizationID,
		RoleOrg:        orgRole,
	}).Error
}

func (r *OrganizationRepository) Create(org *models.Organization) (*models.Organization, error) {
	if err := r.db.Create(org).Error; err != nil {
		return nil, err
	}
	return org, nil
}
