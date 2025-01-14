package controllers

import (
	"net/http"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/services"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type OrganizationController struct {
	organizationService services.OrganizationService
}

// Postorganization godoc
// @Summary Create organization
// @Description Crete organization
// @Tags user
// @Accept json
// @Produce json
// @Router /api/v1/organization [post]
// @Param user body models.CreateNewOrganization true "Create organization"
// @Security BearerAuth
func (h *OrganizationController) CreateOrganization(c echo.Context) error {
	user := module.ReturnClaim(c)
	if user.Role != "ROLE_SUPER_ADMIN" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "User not allowed"})
	}

	var req models.CreateNewOrganization
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	newOrganizaton, err := h.organizationService.CreateOrganization(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	userUuid := uuid.MustParse(user.Id)
	_, err = h.organizationService.AddUserToOrganization(userUuid, newOrganizaton.ID, models.AdminOrgRole)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, newOrganizaton)
}
