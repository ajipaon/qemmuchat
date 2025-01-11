package v1

import (
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/repository"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func UserRoutes(g *echo.Group, db *gorm.DB) {
	userRepo := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	g.GET("/all", userController.GetAllUser)
	g.GET("/:id", userController.GetUserByID)
	g.GET("", userController.GetUser)
	g.GET("/change/organization/:id", userController.ChangeOrganization)
	g.GET("/admin/all", userController.GetAllUserAdmin)

}
