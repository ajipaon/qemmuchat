package main

import (
	"fmt"
	"log"
	"os"
	"qemmuChat/qemmu/module/webpush"
	"qemmuChat/qemmu/routes"

	_ "qemmuChat/docs"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// @title Swagger QemmuChat API
// @version 1.0
// @description This is a Swagger QemmuChat API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {

	dbFile := "./webpush.db"
	if _, err := os.Stat(dbFile); os.IsNotExist(err) {
		fmt.Println("File database.db tidak ditemukan, akan dibuat secara otomatis.")
	}

	dblite, err := gorm.Open(sqlite.Open(dbFile), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	err = webpush.AutoMigrate(dblite)

	if err == nil {
		vapidKey, _ := webpush.InitVapidKeys(dblite)
		os.Setenv("VAPID_PUBLIC_KEY", vapidKey.PublicKey)
		os.Setenv("VAPID_PRIVATE_KEY", vapidKey.PrivateKey)
	}
	webpush.GetInstanceWithDB(dblite).RegisterListeners()
	e := routes.Routing(dblite)
	err = e.Start(fmt.Sprintf(":%d", 8080))
	if err != nil {
		return
	}
}
