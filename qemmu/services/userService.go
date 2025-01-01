package services

import (
	"errors"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAllUsers() ([]models.Users, error)
	GetUserByID(id uint) (*models.Users, error)
	CreateUser(user *models.RegisterUserRequest) error
	UpdateUser(user *models.Users) error
	DeleteUser(id uint) error
	GetUserByEmail(email string) (*models.Users, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo}
}

func (s *userService) GetAllUsers() ([]models.Users, error) {
	return s.userRepo.GetAll()
}

func (s *userService) GetUserByID(id uint) (*models.Users, error) {
	return s.userRepo.GetByID(id)
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

	user := &models.Users{
		Name:     userRegister.Name,
		Email:    userRegister.Email,
		Password: string(hashedPassword),
	}

	count, err := s.userRepo.Count()

	if count == 0 {
		user.Role = "ROLE_ADMIN"
	}

	return s.userRepo.Create(user)
}

func (s *userService) UpdateUser(user *models.Users) error {
	return s.userRepo.Update(user)
}

func (s *userService) DeleteUser(id uint) error {
	return s.userRepo.Delete(id)
}

func (s *userService) GetUserByEmail(email string) (*models.Users, error) {

	return s.userRepo.GetByEmail(email)
}
