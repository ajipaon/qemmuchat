package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/config"
	"github.com/ajipaon/qemmuChat/qemmu/models"
)

type MessageRepository struct {
	db config.Config
}

func (r *MessageRepository) Create(message *models.Message) error {
	if err := r.db.GetDb().Create(message).Error; err != nil {
		return err
	}
	return nil
}
