package v1

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
	"qemmuChat/qemmu/models"
)

func NotificationRoute(g *echo.Group) {
	broker := models.NewBroker()
	g.GET("/:id", func(c echo.Context) error {
		id := c.Param("id")
		ch := broker.Subscribe(id)

		defer broker.Unsubscribe(id)

		c.Response().Header().Set(echo.HeaderContentType, "text/event-stream")
		c.Response().WriteHeader(http.StatusOK)

		for {
			select {
			case msg, ok := <-ch:
				if !ok {
					return nil
				}
				_, err := fmt.Fprintf(c.Response(), "data: %s\n\n", msg)
				if err != nil {
					return err
				}
				c.Response().Flush()
			}
		}
	})

}
