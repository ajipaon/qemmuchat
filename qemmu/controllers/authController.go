package controllers

import (
	"fmt"
	"net/http"
	"qemmuChat/qemmu/config"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	userService services.UserService
}

func NewAuthController(userService services.UserService) *AuthController {
	return &AuthController{userService}
}

// Register godoc
// @Summary Register a new user
// @Description Register a new user with the given details
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.RegisterUserRequest true "Register User"
// @Router /auth/register [post]
func (h *AuthController) Register(c echo.Context) error {
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

// Login godoc
// @Summary Login user
// @Description Login user
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.LoginUserRequest true "Register User"
// @Router /auth/login [post]
func (h *AuthController) Login(c echo.Context) error {
	var req models.LoginUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}
	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var email = req.Email
	user, err := h.userService.GetUserByEmail(email)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "User not found"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid email or password"})
	}
	userResponse := module.ConvertUserResponse(user)

	token, err := config.GenerateJwt(user)

	c.Response().Header().Set("Authorization", fmt.Sprintf("Bearer %s", token))

	return c.JSON(http.StatusOK, map[string]interface{}{"message": "Login successful", "data": userResponse})
}
