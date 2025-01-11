package services

import (
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"
)

type ConfigurationService interface {
	CreateConfig(config *models.ConfigurationRequest) error
	GetConfig(name models.ConfigName) (*models.Config, error)
}

type configurationService struct {
	configRepository repository.ConfigurationRepository
}

func NewConfigurationService(configRepository repository.ConfigurationRepository) ConfigurationService {
	return &configurationService{configRepository}
}

func (s *configurationService) CreateConfig(configRequest *models.ConfigurationRequest) error {

	config := &models.Config{
		Name: configRequest.Name,
	}
	switch configRequest.Name {
	case models.AppName:
		config.Type = models.TypeText
		config.Data = configRequest.Data
	case models.MqttConfig:
		config.Type = models.TypeJson
		config.Data = configRequest.Data
	}
	return s.configRepository.Create(config)

}

func (s *configurationService) GetConfig(name models.ConfigName) (*models.Config, error) {

	existingConfig, err := s.configRepository.GetConfigByname(name)
	if err != nil {
		return nil, err
	}

	return existingConfig, nil

}
