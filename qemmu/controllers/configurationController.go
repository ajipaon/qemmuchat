package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/services"
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
// @Router /v1/config [post]
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
