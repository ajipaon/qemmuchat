package v1

import (
	"net/http"
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
	// g.POST("", createUser)
	g.GET("/:id", userController.GetUserByID)
	// g.PUT("/:id", updateUser)
	// g.DELETE("/:id", deleteUser)
}

func getUser(c echo.Context) error {
	return c.String(http.StatusOK, "Get all users")
}

func createUser(c echo.Context) error {
	return c.String(http.StatusCreated, "Create user")
}

func getUserByID(c echo.Context) error {
	id := c.Param("id")
	return c.String(http.StatusOK, "Get user by ID: "+id)
}

func updateUser(c echo.Context) error {
	id := c.Param("id")
	return c.String(http.StatusOK, "Update user with ID: "+id)
}

func deleteUser(c echo.Context) error {
	id := c.Param("id")
	return c.String(http.StatusOK, "Delete user with ID: "+id)
}
