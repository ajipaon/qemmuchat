package config

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB
var dbName = "public"

func InitDB() *gorm.DB {
	//postgres://postgres:123@localhost:5432/123123
	dsn := fmt.Sprintf("host=localhost user=postgres password=123 port=5432 sslmode=disable TimeZone=Asia/Jakarta")
	//dsn := os.Getenv("POSTGRES_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	log.Println("Database connected successfully!")
	return DB
}
