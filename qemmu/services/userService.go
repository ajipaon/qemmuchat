package services

import (
	"errors"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"

	"github.com/google/uuid"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo repository.UserRepository
}

func (s *UserService) GetAllUsers(page, limit int, name, role, email string) ([]models.User, int, error) {

	return s.userRepo.GetAll(page, limit, name, role, email)
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	return s.userRepo.GetByID(uuid.MustParse(id))
}

func (s *UserService) CreateUser(userRegister *models.RegisterUserRequest) error {

	existingUser, err := s.userRepo.GetByEmail(userRegister.Email)
	if err == nil && existingUser != nil {
		return errors.New("email already registered")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userRegister.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	user := &models.User{
		Name:     userRegister.Name,
		Email:    userRegister.Email,
		Password: string(hashedPassword),
	}

	count, err := s.userRepo.Count()

	if count == 0 {
		user.Role = models.RoleSuperAdmin
	}

	return s.userRepo.Create(user)
}

func (s *UserService) UpdateUser(user *models.User) error {
	return s.userRepo.Update(user)
}

func (s *UserService) DeleteUser(id uint) error {
	return s.userRepo.Delete(id)
}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {

	return s.userRepo.GetByEmail(email)
}

func (s *UserService) GetUserAndOrganization(userId string) *models.User {
	user, _ := s.userRepo.GetUserWithOrganizations(userId)

	return user
}

func (s *UserService) ChangeOrganization(userId string, organizationId string) (*models.User, error) {

	user, err := s.userRepo.GetByID(uuid.MustParse(userId))

	if err != nil {
		return nil, errors.New(err.Error())
	}
	user.LastOrganization = organizationId
	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}
	return user, nil

}

func (s *UserService) GetSUperAdmin() (*models.User, error) {

	user, err := s.userRepo.GetByRole("ROLE_SUPER_ADMIN")

	if err != nil {
		return nil, errors.New(err.Error())
	}
	return user, nil

}
