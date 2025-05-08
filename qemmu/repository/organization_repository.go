package repository

import (
	"fmt"

	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationRepository interface {
	GetAll() ([]models.Organization, error)
	GetOrganization(id string) (*models.Organization, error)
	AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) error
	Create(org *models.Organization) (*models.Organization, error)
	UpdateUserRoleOrg(userId, orgId uuid.UUID, newRole models.RoleOrganization) error
}

type organizationRepository struct {
	db *gorm.DB
}

func NewOrganizationRepository(db *gorm.DB) OrganizationRepository {
	return &organizationRepository{db: db}
}

func (r *organizationRepository) GetAll() ([]models.Organization, error) {
	var organizations []models.Organization
	err := r.db.Find(&organizations).Error
	return organizations, err
}

func (r *organizationRepository) GetOrganization(id string) (*models.Organization, error) {
	var organization models.Organization
	err := r.db.First(&organization, id).Error
	return &organization, err
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

func (r *organizationRepository) UpdateUserRoleOrg(userId, orgId uuid.UUID, newRole models.RoleOrganization) error {
	result := r.db.Model(&models.UserOrganization{}).
		Where("organization_id = ? AND user_id = ?", orgId, userId).
		Update("role_org", newRole)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("no record found to update")
	}
	return nil
}
