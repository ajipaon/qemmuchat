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
	authController := controllers.NewAuthController(userService)

	g.POST("/register", authController.Register)
	g.POST("/login", authController.Login)

}
