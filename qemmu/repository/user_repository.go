package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetAll(page, limit int, name, role, email string) ([]models.User, int, error)
	GetAllByOrganization(orgId uuid.UUID, name, email string, page, limit int) ([]models.User, int, error)
	GetByID(id uuid.UUID) (*models.User, error)
	Create(user *models.User) error
	Update(user *models.User) error
	Delete(id uint) error
	GetByEmail(email string) (*models.User, error)
	Count() (int64, error)
	GetUserWithOrganizations(userId string) (*models.User, error)
	GetByRole(role string) (*models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetAll(page, limit int, name, role, email string) ([]models.User, int, error) {
	var users []models.User
	var total int64

	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := r.db.Preload("Activity").Model(&models.User{}).Select("id", "name", "image", "first_login", "role", "status", "created_at", "updated_at", "Email")

	query = query.Where("role NOT LIKE ?", "ROLE_SUPER_ADMIN")

	if name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}

	if email != "" {
		query = query.Where("email LIKE ?", "%"+email+"%")
	}

	if role != "" {
		query = query.Where("role LIKE ?", role)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Offset(offset).Limit(limit).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, int(total), nil
}

func (r *userRepository) GetAllByOrganization(orgId uuid.UUID, name, email string, page, limit int) ([]models.User, int, error) {
	var users []models.User
	var total int64

	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}
	query := r.db.Select("users.id, users.name, users.email, users.image, users.first_login, users.status, users.created_at, users.updated_at, user_organizations.role_org as role").
		Joins("JOIN user_organizations ON users.id = user_organizations.user_id").
		Where("user_organizations.organization_id = ?", orgId).
		Omit("Activities")

	query = query.Where("user_organizations.role_org NOT LIKE ?", "SUPER_ADMIN")

	if name != "" {
		query = query.Where("users.name LIKE ?", "%"+name+"%")
	}

	if email != "" {
		query = query.Where("users.email LIKE ?", "%"+email+"%")
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Offset(offset).Limit(limit).Find(&users).Error
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
	return count, err
}

func (r *userRepository) GetUserWithOrganizations(userId string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Organizations").First(&user, "id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByRole(role string) (*models.User, error) {
	var user models.User
	err := r.db.Where("role = ?", role).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
