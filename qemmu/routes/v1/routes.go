package v1

import (
	"github.com/ajipaon/qemmuChat/qemmu/controllers"

	"github.com/labstack/echo/v4"
)

type RoutingControllers struct {
	ActivityController     controllers.ActivityController
	ConfigController       controllers.ConfigurationController
	OrganizationController controllers.OrganizationController
	UserController         controllers.UserController
}

func RegisterRoutes(api *echo.Group, s RoutingControllers) {
	v1Group := api.Group("/v1")

	//activity route
	activityGroup := v1Group.Group("/activity")
	activityRoutes(activityGroup, s.ActivityController)

	// config route
	configGroup := v1Group.Group("/config")
	configRoutes(configGroup, s.ConfigController)

	// organizaiton route
	organizationGroup := v1Group.Group("/organization")
	organizationRoutes(organizationGroup, s.OrganizationController)

	// user route
	userGroup := v1Group.Group("/user")
	userRoutes(userGroup, s.UserController)
}

func activityRoutes(g *echo.Group, c controllers.ActivityController) {
	g.GET("/heartbeat", c.ActivityHeartbeat)
	g.GET("/test", c.Activitytest)
}

func configRoutes(g *echo.Group, c controllers.ConfigurationController) {
	g.POST("", c.NewConfig)
	g.GET("", c.GetConfig)
}

func organizationRoutes(g *echo.Group, c controllers.OrganizationController) {
	g.POST("", c.CreateOrganization)
	g.GET("/user/add/:id", c.AddUserToOrganizationSuperAdmin)
	g.PUT("/user/change/role/:id", c.ChageRoleUserOrganizationSuperAdmin)
}

func userRoutes(g *echo.Group, c controllers.UserController) {
	// /api/v1/user/admin/organization/all/{id}
	g.GET("/all", c.GetAllUser)
	g.GET("/:id", c.GetUserByID)
	g.GET("", c.GetUser)
	g.GET("/change/organization/:id", c.ChangeOrganization)
	g.GET("/admin/all", c.GetUserAdminAll)
	g.PATCH("/admin/:id", c.UpdateUserAdmin)
	g.GET("/admin/organization/all/:id", c.GetUserAdminAllByOrganizationId)
	g.GET("/organization/all/:id", c.GetUserAllByOrganizationId)
}
