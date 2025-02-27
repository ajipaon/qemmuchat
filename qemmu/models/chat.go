package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoomType string

const (
	PrivateRoom   RoomType = "PRIVATE_ROOM"
	GroupRoom     RoomType = "GROUP_ROOM"
	TemporaryRoom RoomType = "TEMPORARY_ROOM"
)

type Room struct {
	ID           uuid.UUID         `json:"id"`
	Active       bool              `json:"status" gorm:"default: true"`
	Type         RoomType          `json:"type"`
	CreatedBy    string            `json:"created_by"`
	Participants []RoomParticipant `gorm:"foreignKey:RoomID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

type RoomParticipant struct {
	ID     uint     `json:"id" gorm:"primarykey"`
	RoomID string   `json:"room_id" gorm:"not null"`
	UserID string   `json:"user_id" gorm:"not null"`
	Type   RoomType `json:"type"`
}

type messageType string

const (
	TeporaryMessage messageType = "TEMPORARY_MESSAGE"
	DefaultMessage  messageType = "DEFAULT_MESSAGE"
)

type ContentType string

const (
	TextTypeMessage ContentType = "text"
	JsonTypeMessage ContentType = "json"
	MDTypeMessage   ContentType = "markdown"
)

type StatusMessage string

const (
	SendingStatusMessage  StatusMessage = "SENT"
	ReceivedStatusMessage StatusMessage = "RECEIVED"
	ReadStatusMessage     StatusMessage = "READ"
)

func (s StatusMessage) IsValid() error {
	switch s {
	case SendingStatusMessage, ReceivedStatusMessage, ReadStatusMessage:
		return nil
	default:
		return errors.New("invalid status message")
	}
}

type Message struct {
	ID          string         `json:"id" gorm:"unique primarykey"`
	SenderId    string         `json:"sender_id"`
	RoomId      uuid.UUID      `gorm:"not null;type:uuid"` // roomId is targetId in query param websocket
	RecipientId string         `json:"recipient_id"`
	Type        messageType    `json:"type"`
	ContentType ContentType    `json:"content_type"`
	Content     string         `json:"content"`
	Status      StatusMessage  `json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"update_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}
