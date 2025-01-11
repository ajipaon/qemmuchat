package repository

import (
	"errors"
	"qemmuChat/qemmu/models"

	"gorm.io/gorm"
)

type ConfigurationRepository interface {
	Create(config *models.Config) error
	GetConfigByname(config models.ConfigName) (*models.Config, error)
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

func (r *configurationRepository) GetConfigByname(configName models.ConfigName) (*models.Config, error) {
	var config models.Config
	err := r.db.Where("name = ?", configName).First(&config).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &config, nil
}
