package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/swaggo/echo-swagger"

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

// @host qemmu.swagger.io
// @BasePath /
func main() {
	e := echo.New()

	e.Use(middleware.Logger())

	registerHandlers(e)

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	api := e.Group("/api")

	api.GET("/message", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "Hello, QEMMU"})
	})

	e.Start(fmt.Sprintf(":%d", 8080))
}
