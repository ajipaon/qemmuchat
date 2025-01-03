package repository

import (
	"qemmuChat/qemmu/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetAll() ([]models.Users, error)
	GetByID(id uint) (*models.Users, error)
	Create(user *models.Users) error
	Update(user *models.Users) error
	Delete(id uint) error
	GetByEmail(email string) (*models.Users, error)
	Count() (int64, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) GetAll() ([]models.Users, error) {
	var users []models.Users
	err := r.db.Find(&users).Error
	return users, err
}

func (r *userRepository) GetByID(id uint) (*models.Users, error) {
	var user models.Users
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *userRepository) Create(user *models.Users) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *models.Users) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&models.Users{}, id).Error
}

func (r *userRepository) GetByEmail(email string) (*models.Users, error) {
	var user models.Users
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Users{}).Count(&count).Error
	if err != nil {
		return count, err
	}
	return count, nil
}
