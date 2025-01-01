package v1

import (
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/repository"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func ConfigRoutes(g *echo.Group, db *gorm.DB) {
	configRepository := repository.NewConfigurationRepository(db)
	configService := services.NewConfigurationService(configRepository)
	configController := controllers.NewConfigurationController(configService)

	g.POST("", configController.NewConfig)
	g.GET("", configController.GetConfig)

}
