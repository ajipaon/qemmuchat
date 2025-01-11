package repository

import (
	"fmt"
	"qemmuChat/qemmu/models"

	"github.com/google/uuid"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetAll(page, limit int, search string) ([]models.User, int, error)
	GetByID(id uuid.UUID) (*models.User, error)
	Create(user *models.User) error
	Update(user *models.User) error
	Delete(id uint) error
	GetByEmail(email string) (*models.User, error)
	Count() (int64, error)
	GetUserWithOrganizations(userId string) (*models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) GetAll(page, limit int, search string) ([]models.User, int, error) {
	var users []models.User
	var total int64

	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := r.db.Model(&models.User{}).Select("name", "image", "first_login", "role", "status", "created_at", "updated_at", "Email")

	if search != "" {
		search = fmt.Sprintf("%%%s%%", search)
		query = query.Where("name LIKE ? OR email LIKE ?", search, search)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Limit(limit).Offset(offset).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, int(total), nil
}

func (r *userRepository) GetByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Count(&count).Error
	if err != nil {
		return count, err
	}
	return count, nil
}

func (r *userRepository) GetUserWithOrganizations(userId string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Organizations").First(&user, "id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
