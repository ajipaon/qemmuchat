package services

import (
	"errors"
	"fmt"
	"github.com/google/uuid"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAllUsers(page, limit int, search string) ([]models.User, int, error)
	GetUserByID(id string) (*models.User, error)
	CreateUser(user *models.RegisterUserRequest) error
	UpdateUser(user *models.User) error
	DeleteUser(id uint) error
	GetUserByEmail(email string) (*models.User, error)
	GetUserAndOrganization(userId string) *models.User
	ChangeOrganization(userId string, organizationId string) (*models.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo}
}

func (s *userService) GetAllUsers(page, limit int, search string) ([]models.User, int, error) {

	return s.userRepo.GetAll(page, limit, search)
}

func (s *userService) GetUserByID(id string) (*models.User, error) {
	return s.userRepo.GetByID(uuid.MustParse(id))
}

func (s *userService) CreateUser(userRegister *models.RegisterUserRequest) error {

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

func (s *userService) UpdateUser(user *models.User) error {
	return s.userRepo.Update(user)
}

func (s *userService) DeleteUser(id uint) error {
	return s.userRepo.Delete(id)
}

func (s *userService) GetUserByEmail(email string) (*models.User, error) {

	return s.userRepo.GetByEmail(email)
}

func (s *userService) GetUserAndOrganization(userId string) *models.User {
	user, _ := s.userRepo.GetUserWithOrganizations(userId)

	return user
}

func (s *userService) ChangeOrganization(userId string, organizationId string) (*models.User, error) {

	user, err := s.userRepo.GetByID(uuid.MustParse(userId))

	if err != nil {
		return nil, errors.New(err.Error())
	}
	fmt.Println(user)
	user.LastOrganization = organizationId
	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}
	return user, nil

}
