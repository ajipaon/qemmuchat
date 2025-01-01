package models

import (
	"gorm.io/gorm"
	"log"
	"qemmuChat/qemmu/config"
)

var DB *gorm.DB

func Init() *gorm.DB {
	DB = config.InitDB()
	if err := DB.AutoMigrate(&Users{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := DB.AutoMigrate(&Config{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	return DB
}
