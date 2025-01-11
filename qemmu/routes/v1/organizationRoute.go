package v1

import (
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/repository"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// path: /api/v1/organization
func OrganizationRoutes(g *echo.Group, db *gorm.DB) {
	organizationRepository := repository.NewOrganizationRepository(db)
	organizationService := services.NewOrganizationService(organizationRepository)
	organizationController := controllers.NewOrganizationController(organizationService)

	g.POST("", organizationController.CreateOrganization)

}
