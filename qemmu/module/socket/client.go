package socket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/ajipaon/qemmuChat/qemmu/repository"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 55 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 1 << 19
)

type MessageWs struct {
	Id      string               `json:"id"`
	Content string               `json:"content"`
	RoomID  string               `json:"room_id"`
	Status  models.StatusMessage `json:"status"`
	Role    string               `json:"role"`
	Types   string               `json:"types"`
}

type Client struct {
	ID          string
	RoomID      string
	TypeRoom    string
	Conn        *websocket.Conn
	Message     chan *MessageWs
	messageRepo repository.MessageRepository
}

func (c *Client) readPump(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()

	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))

	for {
		_, m, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		var jsonString string
		err = json.Unmarshal([]byte(m), &jsonString)
		if err != nil {
			fmt.Println("Error decoding stringified JSON:", err)
			return
		}

		var msg MessageWs
		err = json.Unmarshal([]byte(jsonString), &msg)
		if err != nil {
			fmt.Println("Error decoding JSON object:", err)
			return
		}
		switch msg.Types {
		case "MESSAGE":
			if _, ok := hub.Rooms[msg.RoomID]; ok {
				msg.Status = models.ReceivedStatusMessage
				hub.Broadcast <- &msg
			}

			go c.saveMessage(c.RoomID, c.ID, msg)

			if c.RoomID != msg.RoomID {
				msgs := &MessageWs{
					Id:      msg.Id,
					Content: msg.Content,
					RoomID:  c.RoomID,
					Status:  msg.Status,
					Role:    msg.Role,
					Types:   msg.Types,
				}
				hub.Broadcast <- msgs
			}

		default:
			fmt.Println("not found")
		}

	}
}

func (c *Client) saveMessage(roomId, userId string, m MessageWs) error {

	message := &models.Message{
		ID:          m.Id,
		SenderId:    userId,
		RoomId:      uuid.MustParse(roomId),
		RecipientId: m.RoomID,
		Type:        models.DefaultMessage,
		ContentType: "text",
		Status:      m.Status,
		Content:     m.Content,
	}

	c.messageRepo.Create(message)

	return nil
}
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Message:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteJSON(message); err != nil {
				log.Printf("error: %v", err)
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("error: %v", err)
				return
			}
		}
	}
}
