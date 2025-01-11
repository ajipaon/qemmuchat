package services

import (
	"github.com/google/uuid"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"
)

type OrganizationService interface {
	CreateOrganization(organization models.CreateNewOrganization) (*models.Organization, error)
	AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) (*models.Organization, error)
}

type organizationService struct {
	organizationRepo repository.OrganizationRepository
}

func NewOrganizationService(userRepo repository.OrganizationRepository) OrganizationService {
	return &organizationService{userRepo}
}

func (s *organizationService) CreateOrganization(organization models.CreateNewOrganization) (*models.Organization, error) {

	newOrg := &models.Organization{
		Name: string(organization.Name),
	}

	resultNewOrg, err := s.organizationRepo.Create(newOrg)
	if err != nil {
		return nil, err
	}
	return resultNewOrg, nil
}
func (s *organizationService) AddUserToOrganization(userId uuid.UUID, organizationID uuid.UUID, orgRole models.RoleOrganization) (*models.Organization, error) {

	err := s.organizationRepo.AddUserToOrganization(userId, organizationID, orgRole)

	if err != nil {
		return nil, err
	}

	return nil, nil
}

// func (s *organizationService) GetAllOrganizationUser() ([]models.Organization, error) {

// }
