package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/services"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{userService}
}

// Register godoc
// @Summary Register a new user
// @Description Register a new user with the given details
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.RegisterUserRequest true "Register User"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /auth/register [post]
func (h *UserController) Register(c echo.Context) error {
	var req models.RegisterUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}
	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	if err := h.userService.CreateUser(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, "Register success")
}
