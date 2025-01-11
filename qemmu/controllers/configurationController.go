package controllers

import (
	"fmt"
	"net/http"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
)

type ConfigurationController struct {
	configService services.ConfigurationService
}

func NewConfigurationController(configService services.ConfigurationService) *ConfigurationController {
	return &ConfigurationController{configService}
}

// NewConfig godoc
// @Summary Create new Config
// @Description Create new Config
// @Tags config
// @Accept json
// @Produce json
// @Param user body models.ConfigurationRequest true "New Config"
// @Router /api/v1/config [post]
// @Security BearerAuth
func (h *ConfigurationController) NewConfig(c echo.Context) error {
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
// @Router /api/v1/config [get]
// @Security BearerAuth
func (h *ConfigurationController) GetConfig(c echo.Context) error {
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
