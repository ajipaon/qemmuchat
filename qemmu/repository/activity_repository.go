package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ActivityRepository interface {
	Create(activity *models.Activity) error
	GetById(userId uuid.UUID) (*models.Activity, error)
	Update(activity *models.Activity) error
}

type activityRepository struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) ActivityRepository {
	return &activityRepository{db: db}
}

func (r *activityRepository) Create(activity *models.Activity) error {
	return r.db.Create(activity).Error
}

func (r *activityRepository) GetById(userId uuid.UUID) (*models.Activity, error) {
	var userActivity models.Activity
	err := r.db.Where("user_id = ?", userId).First(&userActivity).Error
	return &userActivity, err
}

func (r *activityRepository) Update(activity *models.Activity) error {
	return r.db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(activity).Error
}
