package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/swaggo/echo-swagger"
	"qemmuChat/qemmu/lib"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/routes"
	v1 "qemmuChat/qemmu/routes/v1"

	"net/http"
	_ "qemmuChat/docs"
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

// @BasePath /api
func main() {

	DB := models.Init()

	e := echo.New()

	registerHandlers(e)

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	api := e.Group("/api")
	api.Use(middleware.Logger())

	e.Validator = lib.NewValidator()
	e.GET("/ws", module.UseNet)

	//auth
	routes.AuthRoutes(api.Group("/auth"), DB)
	//v1
	v1.UserRoutes(api.Group("/v1/user"))
	v1.ConfigRoutes(api.Group("/v1/config"), DB)

	api.GET("/message", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "Hello, QEMMU"})
	})

	err := e.Start(fmt.Sprintf(":%d", 8080))
	if err != nil {
		return
	}
}
