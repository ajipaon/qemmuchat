package models

import (
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
	SendingStatusMessage  StatusMessage = "SENDING"
	ReceivedStatusMessage StatusMessage = "RECEIVED"
	ReadStatusMessage     StatusMessage = "READ"
)

type Message struct {
	ID          string         `json:"id" gorm:"unique"`
	SenderId    string         `json:"sender_id"`
	RoomId      uuid.UUID      `gorm:"not null;type:uuid"` // roomId is targetId in query param websocket
	RecipientId string         `json:"recipient_id"`
	Type        messageType    `json:"type" gorm:"default: DEFAULT_MESSAGE"`
	ContentType ContentType    `json:"content_type" gorm:"default: TEXT"`
	Content     string         `json:"content" gorm:"default: TEXT"`
	Status      StatusMessage  `json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"update_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}
