package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/config"
	"github.com/ajipaon/qemmuChat/qemmu/models"

	"github.com/google/uuid"
	"gorm.io/gorm/clause"
)

type ActivityRepository struct {
	db config.Config
}

func (r *ActivityRepository) Create(activity *models.Activity) error {
	if err := r.db.GetDb().Create(activity).Error; err != nil {
		return err
	}
	return nil
}

func (r *ActivityRepository) GetById(userId uuid.UUID) (*models.Activity, error) {
	var userActivity models.Activity
	err := r.db.GetDb().Where("user_id = ?", userId).First(&userActivity).Error
	return &userActivity, err
}

func (r *ActivityRepository) Update(activity *models.Activity) error {

	if err := r.db.GetDb().Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(activity).Error; err != nil {
		return err
	}
	return nil
}
