package services

import (
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"

	"github.com/google/uuid"
)

type OrganizationService struct {
	organizationRepo repository.OrganizationRepository
}

func (s *OrganizationService) CreateOrganization(organization models.CreateNewOrganization) (*models.Organization, error) {

	newOrg := &models.Organization{
		Name: string(organization.Name),
	}

	resultNewOrg, err := s.organizationRepo.Create(newOrg)
	if err != nil {
		return nil, err
	}
	return resultNewOrg, nil
}
func (s *OrganizationService) AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) (*models.Organization, error) {

	err := s.organizationRepo.AddUserToOrganization(userId, organizationID, orgRole)

	if err != nil {
		return nil, err
	}

	return nil, nil
}

// func (s *organizationService) GetAllOrganizationUser() ([]models.Organization, error) {

// }
