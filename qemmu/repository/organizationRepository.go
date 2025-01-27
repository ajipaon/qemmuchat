package repository

import (
	"fmt"
	"qemmuChat/qemmu/config"
	"qemmuChat/qemmu/models"

	"github.com/google/uuid"
)

type OrganizationRepository struct {
	db config.Config
}

func (r *OrganizationRepository) GetAll() ([]models.Organization, error) {
	var organizaiton []models.Organization
	err := r.db.GetDb().Find(&organizaiton).Error
	return organizaiton, err
}

func (r *OrganizationRepository) GetOrganization(id string) (*models.Organization, error) {
	var organizaiton models.Organization
	err := r.db.GetDb().First(&organizaiton, id).Error
	return &organizaiton, err
}

func (r *OrganizationRepository) AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) error {
	return r.db.GetDb().Create(&models.UserOrganization{
		UserID:         userId,
		OrganizationID: organizationID,
		RoleOrg:        orgRole,
	}).Error
}

func (r *OrganizationRepository) Create(org *models.Organization) (*models.Organization, error) {
	if err := r.db.GetDb().Create(org).Error; err != nil {
		return nil, err
	}
	return org, nil
}

func (r *OrganizationRepository) UpdateUserRoleOrg(userId, orgId uuid.UUID, newRole models.RoleOrganization) error {

	fmt.Println(orgId)
	result := r.db.GetDb().
		Model(&models.UserOrganization{}).
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
