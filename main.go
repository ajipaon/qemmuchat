package main

import (
	"fmt"
	"os"
	"qemmuChat/qemmu/config"
	"qemmuChat/qemmu/lib"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/routes"
	v1 "qemmuChat/qemmu/routes/v1"
	"qemmuChat/qemmuWeb"

	"net/http"
	_ "qemmuChat/docs"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title Swagger QemmuChat API
// @version 1.0
// @description This is a Swagger QemmuChat API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {

	DB := config.Init()

	e := echo.New()

	qemmuWeb.RegisterHandlers(e)

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	api := e.Group("/api")

	routes.AuthRoutes(e.Group("/auth"), DB)

	api.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Validator = lib.NewValidator()

	api.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		ExposeHeaders: []string{"Authorization"},
	}))

	e.GET("/ws", module.UseNet)

	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(module.JwtCustomClaims)
		},
		SigningKey: []byte(os.Getenv("SECRET")),
	}
	api.Use(echojwt.WithConfig(config))
	//v1
	v1.UserRoutes(api.Group("/v1/user"), DB)
	v1.ConfigRoutes(api.Group("/v1/config"), DB)
	v1.OrganizationRoutes(api.Group("/v1/organization"), DB)
	v1.NotificationRoute(api.Group("/v1/notification"))

	api.GET("/message", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "Hello, QEMMU"})
	})

	err := e.Start(fmt.Sprintf(":%d", 8080))
	if err != nil {
		return
	}
}
