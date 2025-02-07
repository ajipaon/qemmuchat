package config

import (
	"fmt"
	"log"
	"os"

	"github.com/ajipaon/qemmuChat/qemmu/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	DB *gorm.DB
}

func (c *Config) GetDb() *gorm.DB {

	if c.DB == nil {
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s port=%s sslmode=disable TimeZone=%s",
			os.Getenv("POSTGRES_HOST"),
			os.Getenv("POSTGRES_USER"),
			os.Getenv("POSTGRES_PASS"),
			os.Getenv("POSTGRES_PORT"),
			os.Getenv("POSTGRES_TIME"),
		)

		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}
		log.Println("Database connected successfully!")
		if err := db.AutoMigrate(&models.User{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		if err := db.AutoMigrate(&models.Config{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		if err := db.AutoMigrate(&models.Organization{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		if err := db.AutoMigrate(&models.Activity{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		if err := db.AutoMigrate(&models.UserOrganization{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		// if err := db.AutoMigrate(&models.Room{}); err != nil {
		// 	log.Fatalf("failed to migrate database: %v", err)
		// }
		// if err := db.AutoMigrate(&models.RoomParticipant{}); err != nil {
		// 	log.Fatalf("failed to migrate database: %v", err)
		// }
		if err := db.AutoMigrate(&models.Message{}); err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}
		c.DB = db
	}
	return c.DB
}
