package repository

import (
	"github.com/ajipaon/qemmuChat/qemmu/config"
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/google/uuid"
)

type RoomRepository struct {
	db config.Config
}

func (r *RoomRepository) GetRoomPrivateByParticipants(user1, user2 string, typeRoom models.RoomType) (*models.Room, error) {

	var room models.Room
	err := r.db.GetDb().Raw(`
    SELECT r.room_id, r.user_id, r.type
    FROM rooms r
    JOIN room_participants rp1 ON r.room_id = rp1.room_id
    JOIN room_participants rp2 ON r.room_id = rp2.room_id
    WHERE rp1.user_id = ?
      AND rp2.user_id = ?
      AND rp1.type = ?
      AND (
          SELECT COUNT(*)
          FROM room_participants rp
          WHERE rp.room_id = r.room_id
      ) = 2;
`, user1, user2, typeRoom).Scan(&room).Error

	if err != nil {
		return nil, err
	}

	if room.ID == uuid.Nil {
		return nil, nil
	}

	return &room, nil

}

func (r *RoomRepository) Create(room *models.Room) error {
	return r.db.GetDb().Create(room).Error
}

func (r *RoomRepository) AddParticipantByRoom(roomId, userId string, typeRoom models.RoomType) error {
	participant := models.RoomParticipant{
		RoomID: roomId,
		UserID: userId,
		Type:   typeRoom,
	}
	return r.db.GetDb().Create(&participant).Error
}
