package config

import (
	"log"
	"qemmuChat/qemmu/models"

	"gorm.io/gorm"
)

func Init() *gorm.DB {
	DB = InitDB()
	if err := DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := DB.AutoMigrate(&models.Config{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := DB.AutoMigrate(&models.Organization{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := DB.AutoMigrate(&models.Activity{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := DB.AutoMigrate(&models.UserOrganization{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	return DB
}
