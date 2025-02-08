package controllers

import (
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/ajipaon/qemmuChat/qemmu/module"
	"github.com/ajipaon/qemmuChat/qemmu/module/webpush"
	"github.com/ajipaon/qemmuChat/qemmu/services"
	"github.com/google/uuid"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"strings"
)

type AuthController struct {
	userService   services.UserService
	configService services.ConfigurationService
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

	user, err := h.userService.GetSUperAdmin()

	if err == nil {
		webPushBus := webpush.GetInstanceWithDB(nil)
		message := fmt.Sprintf("New user register with email: %s\n", req.Email)
		userId := user.ID.String()
		webPushBus.WebPushNotificationPublisher(userId, "New user Register", message)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Register success"})
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

	token, err := module.GenerateJwt(user)

	sessioName := os.Getenv("session_name")
	fmt.Println(sessioName)
	sess, _ := session.Get(sessioName, c)
	sessionId, _ := uuid.NewUUID()
	sess.Values["sessionId"] = sessionId.String()
	sess.Values["userId"] = userResponse.Id
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	c.Response().Header().Set("Authorization", fmt.Sprintf("Bearer %s", token))

	return c.JSON(http.StatusOK, map[string]interface{}{"message": "Login successful", "data": userResponse})
}

func (h *AuthController) UpdateToken(c echo.Context) error {

	token := c.Request().Header.Get("Authorization")

	if token == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Authorization header is required"})
	}

	parts := strings.Split(token, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid Authorization header format"})
	}
	oldToken := parts[1]

	newToken, err := module.UpdateJwt(oldToken)

	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
	}
	c.Response().Header().Set(echo.HeaderAuthorization, fmt.Sprintf("Bearer %s", newToken))

	return nil

}

// NewConfig godoc
// @Summary Create new Config
// @Description Create new Config
// @Tags config
// @Accept json
// @Produce json
// @Param user body models.ConfigurationRequest true "New Config"
// @Router /auth/config [post]
func (h *AuthController) NewAuthConfig(c echo.Context) error {
	var req models.ConfigurationRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}
	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	if err := h.configService.CreateConfig(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, "Success crate config")
}

// GetConfig godoc
// @Summary Get Config
// @Description Retrieve configuration based on the provided name parameter.
// @Tags config
// @Produce json
// @Param name query string true "name"
// @Router /auth/config [get]
// @Security BearerAuth
func (h *AuthController) GetConfig(c echo.Context) error {
	name := c.QueryParam("name")

	if name == "" {
		return c.String(http.StatusBadRequest, "Parameter 'name' tidak ditemukan")
	}

	var configName models.ConfigName
	switch name {
	case string(models.AppName):
		configName = models.AppName
	case string(models.MqttConfig):
		configName = models.MqttConfig
	default:
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": fmt.Sprintf("Parameter '%s' does not exist", name),
		})
	}

	config, err := h.configService.GetConfig(configName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, config)
}
