package socket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 55 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 1 << 19
)

type Message struct {
	Content string `json:"content"`
	RoomID  string `json:"roomId"`
}

type Client struct {
	ID       string
	RoomID   string
	TypeRoom string
	Conn     *websocket.Conn
	Message  chan *Message
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

		var msg Message
		err = json.Unmarshal([]byte(jsonString), &msg)
		if err != nil {
			fmt.Println("Error decoding JSON object:", err)
			return
		}

		if _, ok := hub.Rooms[msg.RoomID]; ok {
			hub.Broadcast <- &msg
		}

		if c.RoomID != msg.RoomID {
			msgs := &Message{
				Content: msg.Content,
				RoomID:  c.RoomID,
			}
			hub.Broadcast <- msgs
		}

	}
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
