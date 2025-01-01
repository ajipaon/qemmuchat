package routes

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/repository"
	"qemmuChat/qemmu/services"
)

func AuthRoutes(g *echo.Group, db *gorm.DB) {
	userRepo := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	g.POST("/register", userController.Register)

}
