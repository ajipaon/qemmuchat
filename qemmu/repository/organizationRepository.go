package repository

import (
	"github.com/google/uuid"
	"qemmuChat/qemmu/models"

	"gorm.io/gorm"
)

type OrganizationRepository interface {
	Create(org *models.Organization) (*models.Organization, error)
	GetOrganization(id string) (*models.Organization, error)
	GetAll() ([]models.Organization, error)
	AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) error
}

type organizationRepository struct {
	db *gorm.DB
}

func NewOrganizationRepository(db *gorm.DB) OrganizationRepository {
	return &organizationRepository{db}
}

func (r *organizationRepository) GetAll() ([]models.Organization, error) {
	var organizaiton []models.Organization
	err := r.db.Find(&organizaiton).Error
	return organizaiton, err
}

func (r *organizationRepository) GetOrganization(id string) (*models.Organization, error) {
	var organizaiton models.Organization
	err := r.db.First(&organizaiton, id).Error
	return &organizaiton, err
}

func (r *organizationRepository) AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) error {
	return r.db.Create(&models.UserOrganization{
		UserID:         userId,
		OrganizationID: organizationID,
		RoleOrg:        orgRole,
	}).Error
}

func (r *organizationRepository) Create(org *models.Organization) (*models.Organization, error) {
	if err := r.db.Create(org).Error; err != nil {
		return nil, err
	}
	return org, nil
}
