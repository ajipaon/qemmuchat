package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/config"
	"github.com/ajipaon/qemmuChat/qemmu/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	db config.Config
}

func (r *UserRepository) GetAll(page, limit int, name, role, email string) ([]models.User, int, error) {
	var users []models.User
	var total int64

	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := r.db.GetDb().Preload("Activity").Model(&models.User{}).Select("id", "name", "image", "first_login", "role", "status", "created_at", "updated_at", "Email")

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

	err = query.Limit(limit).Offset(offset).Order("id asc").Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, int(total), nil
}

func (r *UserRepository) GetAllByOrganization(orgId uuid.UUID, name, email string, page, limit int) ([]models.User, int, error) {
	var users []models.User
	var total int64

	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit
	if offset < 0 {
		offset = 0
	}
	query := r.db.GetDb().Select("users.id, users.name, users.email, users.image, users.first_login, users.status, users.created_at, users.updated_at, user_organizations.role_org as role").Joins("JOIN user_organizations ON users.id = user_organizations.user_id").Where("user_organizations.organization_id = ?", orgId).Omit("Activities").Find(&users)

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

	err = query.Limit(limit).Offset(offset).Order("id asc").Find(&users).Error
	if err != nil {
		return nil, 0, err
	}
	return users, int(total), nil
}

func (r *UserRepository) GetByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.GetDb().First(&user, id).Error
	return &user, err
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.GetDb().Create(user).Error
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.GetDb().Save(user).Error
}

func (r *UserRepository) Delete(id uint) error {
	return r.db.GetDb().Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.GetDb().Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Count() (int64, error) {
	var count int64
	err := r.db.GetDb().Model(&models.User{}).Count(&count).Error
	if err != nil {
		return count, err
	}
	return count, nil
}

func (r *UserRepository) GetUserWithOrganizations(userId string) (*models.User, error) {
	var user models.User
	err := r.db.GetDb().Preload("Organizations").First(&user, "id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByRole(role string) (*models.User, error) {
	var user models.User
	err := r.db.GetDb().Where("role = ?", role).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
