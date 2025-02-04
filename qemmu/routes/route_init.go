package routes

import (
	"github.com/ajipaon/qemmuChat/qemmu/controllers"
	"github.com/ajipaon/qemmuChat/qemmu/lib"
	"github.com/ajipaon/qemmuChat/qemmu/module"
	"github.com/ajipaon/qemmuChat/qemmu/module/socket"
	v1 "github.com/ajipaon/qemmuChat/qemmu/routes/v1"
	"github.com/ajipaon/qemmuChat/qemmuWeb"
	"github.com/gorilla/sessions"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo-contrib/session"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"gorm.io/gorm"
)

func Routing(dblite *gorm.DB) *echo.Echo {

	e := echo.New()

	qemmuWeb.RegisterHandlers(e)
	e.Use(session.Middleware(sessions.NewCookieStore([]byte(os.Getenv("SECRET")))))
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
