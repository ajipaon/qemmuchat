package socket

import (
	"context"
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/module/pb"
	//"github.com/gorilla/websocket"
	"sync"
)

type PbServerChat struct {
	pb.UnimplementedChatServiceServer
	rooms map[string]*Room
	mu    sync.Mutex
}

func NewPbServerChat() *PbServerChat {
	return &PbServerChat{
		rooms: make(map[string]*Room),
	}
}

func (s *PbServerChat) CreateRoom(ctx context.Context, req *pb.CreateRoomReq) (*pb.CreateRoomRes, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	room := &Room{
		ID:      req.Id,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}
	s.rooms[room.ID] = room

	return &pb.CreateRoomRes{Success: true}, nil
}

func (s *PbServerChat) JoinRoom(stream pb.ChatService_JoinRoomServer) error {
	req, err := stream.Recv()
	if err != nil {
		return err
	}

	roomID := req.GetRoomId()
	clientID := req.GetClientId()

	s.mu.Lock()
	room, ok := s.rooms[roomID]
	if !ok {
		s.mu.Unlock()
		return fmt.Errorf("room not found")
	}

	client := &Client{
		ID:      clientID,
		RoomID:  roomID,
		Message: make(chan *Message),
	}
	room.Clients[clientID] = client
	s.mu.Unlock()

	defer func() {
		s.mu.Lock()
		delete(room.Clients, clientID)
		s.mu.Unlock()
	}()

	//go s.broadcastMessages(room, client)

	for {
		msg, err := stream.Recv()
		if err != nil {
			return err
		}

		message := &Message{
			Content: msg.GetContent(),
			RoomID:  roomID,
		}

		s.mu.Lock()
		for _, c := range room.Clients {
			if c.ID != clientID {
				c.Message <- message
			}
		}
		s.mu.Unlock()
	}
}

//func (s *PbServerChat) SecureEndpoint(ctx context.Context, req *pb.SecureRequest) (*pb.SecureResponse, error) {
//	// Ambil username dari context
//	username := ctx.Value("username").(string)
//	log.Printf("Request dari user: %s", username)
//
//	// Proses request
//	return &pb.SecureResponse{Result: "Anda terautentikasi: " + req.Data}, nil
//}

//func (s *ChatServer) broadcastMessages(room *Room, client *Client) {
//	for {
//		select {
//		case msg := <-client.Message:
//			content, _ := json.Marshal(msg)
//			if err := client.Conn.WriteMessage(websocket.TextMessage, content); err != nil {
//				log.Printf("error writing message: %v", err)
//				return
//			}
//		}
//	}
//}
