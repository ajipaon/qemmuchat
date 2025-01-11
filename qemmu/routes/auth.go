package routes

import (
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/repository"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func AuthRoutes(g *echo.Group, db *gorm.DB) {
	userRepo := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepo)

	configRepo := repository.NewConfigurationRepository(db)
	configService := services.NewConfigurationService(configRepo)

	authConfigController := controllers.NewAuthController(userService, configService)

	g.POST("/register", authConfigController.Register)
	g.POST("/login", authConfigController.Login)
	g.POST("/config", authConfigController.NewAuthConfig)
	g.GET("/config", authConfigController.GetConfig)

}
