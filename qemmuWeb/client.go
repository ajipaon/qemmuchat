package qemmuWeb

import (
	"embed"
	"log"
	"net/http"
	"net/url"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	//go:embed dist/*
	dist embed.FS

	//go:embed dist/index.html
	indexHTML embed.FS

	distDirFS     = echo.MustSubFS(dist, "dist")
	distIndexHTML = echo.MustSubFS(indexHTML, "dist")
)

func RegisterHandlers(e *echo.Echo) {
	if os.Getenv("ENV") == "dev" {
		log.Println("Running in dev mode")
		setupDevProxy(e)
		return
	}
	e.FileFS("/", "index.html", distIndexHTML)

	e.StaticFS("/", distDirFS)

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Skipper: func(c echo.Context) bool {
			path := c.Path()
			return len(path) >= 4 && path[:4] == "/api" || len(path) >= 8 && path[:8] == "/swagger" || len(path) >= 5 && path[:5] == "/auth" || len(path) >= 13 && path[:13] == "/notification"
		},
		Root:       "/",
		HTML5:      true,
		Browse:     false,
		IgnoreBase: true,
		Filesystem: http.FS(distDirFS),
	}))
}

func setupDevProxy(e *echo.Echo) {
	url, err := url.Parse("http://localhost:5173")
	if err != nil {
		log.Fatal(err)
	}
	balancer := middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
		{
			URL: url,
		},
	})
	e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
		Balancer: balancer,
		Skipper: func(c echo.Context) bool {
			path := c.Path()
			return len(path) >= 4 && path[:4] == "/api" || len(path) >= 8 && path[:8] == "/swagger" || len(path) >= 5 && path[:5] == "/auth" || len(path) >= 13 && path[:13] == "/notification"
		},
	}))
}
