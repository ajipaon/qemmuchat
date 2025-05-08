package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(message *models.Message) error
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db: db}
}

func (r *messageRepository) Create(message *models.Message) error {
	return r.db.Create(message).Error
}
