package models

import "gorm.io/gorm"

type ConfigName string

const (
	AppName    ConfigName = "APP_NAME"
	MqttConfig ConfigName = "MQTT_CONFIG"
)

type Type string

const (
	TypeJson Type = "JSON"
	TypeText Type = "TEXT"
)

type Config struct {
	gorm.Model
	Name ConfigName `json:"name" gorm:"unique"`
	Type Type       `json:"type" gorm:"string"`
	Data string     `json:"data"`
}

type ConfigurationRequest struct {
	Name ConfigName `json:"name" validate:"required"`
	Data string     `json:"data" validate:"required,min=6"`
}
