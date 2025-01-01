package repository

import (
	"gorm.io/gorm"
	"qemmuChat/qemmu/models"
)

type ConfigurationRepository interface {
	Create(config *models.Config) error
}

type configurationRepository struct {
	db *gorm.DB
}

func NewConfigurationRepository(db *gorm.DB) ConfigurationRepository {
	return &configurationRepository{db}
}

func (r *configurationRepository) Create(config *models.Config) error {
	return r.db.Create(config).Error
}
