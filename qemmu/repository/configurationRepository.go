package repository

import (
	"errors"
	"qemmuChat/qemmu/config"
	"qemmuChat/qemmu/models"

	"gorm.io/gorm"
)

type ConfigurationRepository struct {
	db config.Config
}

func (r *ConfigurationRepository) Create(config *models.Config) error {
	return r.db.GetDb().Create(config).Error
}

func (r *ConfigurationRepository) GetConfigByname(configName models.ConfigName) (*models.Config, error) {
	var config models.Config
	err := r.db.GetDb().Where("name = ?", configName).First(&config).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &config, nil
}
