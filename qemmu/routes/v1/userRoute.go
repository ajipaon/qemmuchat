package v1

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func UserRoutes(g *echo.Group) {
	g.GET("", getUser)
	g.POST("", createUser)
	g.GET("/:id", getUserByID)
	g.PUT("/:id", updateUser)
	g.DELETE("/:id", deleteUser)
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
