package routes

import (
	"qemmuChat/qemmu/controllers"

	"github.com/labstack/echo/v4"
)

type RoutingAuth struct {
	AuthController controllers.AuthController
}

func RegisterAuthRoute(g *echo.Group, s RoutingAuth) {

	g.POST("/register", s.AuthController.Register)
	g.POST("/login", s.AuthController.Login)
	g.POST("/config", s.AuthController.NewAuthConfig)
	g.GET("/config", s.AuthController.GetConfig)

}
