package socket

import (
	"errors"
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/module/logs"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	hub *Hub
}

func NewHandler(h *Hub) *Handler {
	return &Handler{
		hub: h,
	}
}

type CreateRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// CheckOrigin: func(r *http.Request) bool {
	// 	return true
	// },
}

func (h *Handler) CreateRoom(c echo.Context) error {
	var req CreateRoomReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})

	}

	if _, ok := h.hub.Rooms[req.ID]; !ok {
		h.hub.Rooms[req.ID] = &Room{
			ID:      req.ID,
			Name:    req.Name,
			Clients: make(map[string]*Client),
		}
	}

	return c.JSON(http.StatusOK, req)
}

func (h *Handler) JoinRoom(c echo.Context) error {
	roomId := c.Param("roomId")
	clientID := c.QueryParam("userId")
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	var handshakeError websocket.HandshakeError
	if errors.As(err, &handshakeError) {
		logs.Err.Println("ws: Not a websocket handshake")
	}

	client := &Client{
		ID:      clientID,
		RoomID:  roomId,
		Conn:    conn,
		Message: make(chan *Message),
	}

	h.hub.Register <- client

	go client.readPump(h.hub)
	go client.writePump()

	return nil
}

type ClientRes struct {
	ID string `json:"id"`
}

func (h *Handler) GetClients(c echo.Context) error {
	var clients []ClientRes
	roomId := c.Param("roomId")

	if _, ok := h.hub.Rooms[roomId]; !ok {
		clients = make([]ClientRes, 0)
		return c.JSON(http.StatusOK, clients)
	}

	for _, c := range h.hub.Rooms[roomId].Clients {
		fmt.Println(c)
		clients = append(clients, ClientRes{
			ID: c.ID,
		})
	}

	return c.JSON(http.StatusOK, clients)
}
