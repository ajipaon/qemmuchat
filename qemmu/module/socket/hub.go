package socket

import (
	"fmt"
	"log"
	"sync"
)

type Room struct {
	ID       string             `json:"id"`
	Clients  map[string]*Client `json:"clients"`
	TypeRoom string             `json:"type_room"`
}

type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
	mu         sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Register:
			h.mu.Lock()
			if _, ok := h.Rooms[cl.RoomID]; ok {

				r := h.Rooms[cl.RoomID]
				if _, ok := r.Clients[cl.ID]; !ok {
					r.Clients[cl.ID] = cl
					log.Printf("Client %s joined room %s", cl.ID, cl.RoomID)
				} else {
					log.Printf("Client %s is already in room %s", cl.ID, cl.RoomID)
				}
			}
			h.mu.Unlock()
		case cl := <-h.Unregister:
			if r, ok := h.Rooms[cl.RoomID]; ok {
				if _, exists := r.Clients[cl.ID]; exists {
					delete(r.Clients, cl.ID)
					close(cl.Message)
					if len(r.Clients) == 0 {
						delete(h.Rooms, cl.RoomID)
					}
				}
			}

		case m := <-h.Broadcast:
			if _, ok := h.Rooms[m.RoomID]; ok {
				for _, cl := range h.Rooms[m.RoomID].Clients {
					fmt.Println(m)
					cl.Message <- m
				}
			}
		}
	}
}
