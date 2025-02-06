package socket

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/ajipaon/qemmuChat/qemmu/module"
	"github.com/ajipaon/qemmuChat/qemmu/module/logs"
	"github.com/ajipaon/qemmuChat/qemmu/repository"
	"github.com/google/uuid"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	hub      *Hub
	roomRepo repository.RoomRepository
}

func NewHandler(h *Hub) *Handler {
	return &Handler{
		hub: h,
	}
}

type CreateRoomReq struct {
	TargetId string          `json:"target_id"`
	Type     models.RoomType `json:"type"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) CreateRoom(c echo.Context) error {
	user := module.ReturnClaim(c)
	var req CreateRoomReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})

	}

	room, err := h.roomRepo.GetRoomPrivateByParticipants(user.Id, req.TargetId, req.Type)

	if err != nil && req.Type == models.PrivateRoom {
		newRoomId, err := uuid.NewUUID()
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
		}
		room.ID = newRoomId
		room.Type = req.Type
		room.CreatedBy = user.Id
		err = h.roomRepo.Create(room)

		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
		}

		newRoomString := newRoomId.String()
		if _, ok := h.hub.Rooms[newRoomString]; !ok {
			h.hub.Rooms[newRoomString] = &Room{
				ID:      newRoomString,
				Clients: make(map[string]*Client),
			}
		}

		// if _, ok := h.hub.Rooms[room.ID.String()]; !ok {
		// 	h.hub.Rooms[room.ID.String()] = &Room{
		// 		ID:      room.ID.String(),
		// 		Clients: make(map[string]*Client),
		// 	}
		// }

		h.roomRepo.AddParticipantByRoom(newRoomString, user.Id, req.Type)
		h.roomRepo.AddParticipantByRoom(newRoomString, req.TargetId, req.Type)
	}

	return c.JSON(http.StatusOK, req)
}

func (h *Handler) JoinRoom(c echo.Context) error {
	targetId := c.QueryParam("targetId")
	userId := c.Param("userId")
	typeRoom := c.QueryParam("type")

	if typeRoom == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	if targetId == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	if typeRoom == "PRIVATE" && userId == targetId {

		conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		var handshakeError websocket.HandshakeError

		if errors.As(err, &handshakeError) {
			logs.Err.Println("ws: Not a websocket handshake")
			return nil
		}

		if _, ok := h.hub.Rooms[targetId]; !ok {
			h.hub.Rooms[targetId] = &Room{
				ID:      targetId,
				Clients: make(map[string]*Client),
			}
			time.Sleep(1 * time.Second)
		}

		client := &Client{
			ID:       userId,
			RoomID:   targetId,
			TypeRoom: typeRoom,
			Conn:     conn,
			Message:  make(chan *MessageWs),
		}

		h.hub.Register <- client

		go client.readPump(h.hub)
		go client.writePump()

	}

	return nil
}

type ClientRes struct {
	ID string `json:"id"`
}

func (h *Handler) GetClients(c echo.Context) error {
	var clients []ClientRes
	roomId := c.Param("roomId")
	fmt.Println(roomId)

	if _, ok := h.hub.Rooms[roomId]; !ok {
		clients = make([]ClientRes, 0)
		return c.JSON(http.StatusOK, clients)
	}

	for _, c := range h.hub.Rooms[roomId].Clients {
		clients = append(clients, ClientRes{
			ID: c.ID,
		})
	}

	return c.JSON(http.StatusOK, clients)
}
