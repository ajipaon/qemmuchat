package module

import (
	"fmt"
	"time"
	// "github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

func UseNet(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Read
			msg := ""
			err := websocket.Message.Receive(ws, &msg)
			if err != nil {
				c.Logger().Error(err)
			}
			fmt.Printf("%s\n", msg)

			// Write
			if string(msg) == "time" {
				error := websocket.Message.Send(ws, time.Now().String())
				if error != nil {
					c.Logger().Error(error)
				}
			} else {
				error := websocket.Message.Send(ws, msg)
				if error != nil {
					c.Logger().Error(error)
				}
			}

		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
