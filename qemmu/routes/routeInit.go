package routes

import (
	"os"
	"qemmuChat/qemmu/controllers"
	"qemmuChat/qemmu/lib"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/module/socket"
	v1 "qemmuChat/qemmu/routes/v1"
	"qemmuChat/qemmuWeb"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"gorm.io/gorm"
)

func Routing(dblite *gorm.DB) *echo.Echo {

	e := echo.New()

	qemmuWeb.RegisterHandlers(e)
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	api := e.Group("/api")

	controllersAuth := RoutingAuth{
		AuthController: controllers.AuthController{},
	}
	// router register url unauthenticated
	RegisterAuthRoute(e.Group("/auth"), controllersAuth)
	NotificationRoute(e.Group("/notification"), dblite)

	api.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Validator = lib.NewValidator()
	api.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		ExposeHeaders: []string{"Authorization"},
	}))
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(module.JwtCustomClaims)
		},
		SigningKey: []byte(os.Getenv("SECRET")),
	}
	api.Use(echojwt.WithConfig(config))

	hub := socket.NewHub()
	wsHandler := socket.NewHandler(hub)
	go hub.Run()

	e.POST("/chats/createRoom", wsHandler.CreateRoom)
	e.GET("/chats/joinRoom/:roomId", wsHandler.JoinRoom)
	// e.GET("/chats/getRooms", wsHandler.GetRooms)
	e.GET("/chats/getClients/:roomId", wsHandler.GetClients)

	controllers := v1.RoutingControllers{
		ActivityController:     controllers.ActivityController{},
		ConfigController:       controllers.ConfigurationController{},
		OrganizationController: controllers.OrganizationController{},
	}
	// router register v1
	v1.RegisterRoutes(api, controllers)

	return e

}
