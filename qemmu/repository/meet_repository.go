package repository

import (
	"time"

	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MeetRepository interface {
	Create(meet *models.Meet) error
	GetByID(id uuid.UUID) (*models.Meet, error)
	GetAll(params map[string]interface{}) ([]models.Meet, error)
	Update(meet *models.Meet) error
	Delete(id uuid.UUID) error
	GetActiveByTimeRange(start, end time.Time) ([]models.Meet, error)
	GetByOrganizationID(orgID uuid.UUID) ([]models.Meet, error)
	GetByCreator(creatorID uuid.UUID) ([]models.Meet, error)
	GetUpcomingMeets() ([]models.Meet, error)
	AddParticipant(meetID uuid.UUID, userID uuid.UUID) error
	RemoveParticipant(meetID uuid.UUID, userID uuid.UUID) error
	GetParticipants(meetID uuid.UUID) ([]*models.User, error)
	UpdateStatus(meetID uuid.UUID, status models.StatusMeet) error
	CreateOccurrence(occurrence *models.Occurrence) error
	GetOccurrences(meetID uuid.UUID) ([]models.Occurrence, error)
}

type meetRepository struct {
	db *gorm.DB
}

func NewMeetRepository(db *gorm.DB) MeetRepository {
	return &meetRepository{db: db}
}

func (r *meetRepository) Create(meet *models.Meet) error {
	return r.db.Create(meet).Error
}

func (r *meetRepository) GetByID(id uuid.UUID) (*models.Meet, error) {
	var meet models.Meet
	err := r.db.Preload("Participants").Preload("Occurrences").Where("id = ?", id).First(&meet).Error
	if err != nil {
		return nil, err
	}
	return &meet, nil
}

func (r *meetRepository) GetAll(params map[string]interface{}) ([]models.Meet, error) {
	var meets []models.Meet
	query := r.db.Model(&models.Meet{})

	// Apply filters from params
	if status, ok := params["status"].(models.StatusMeet); ok {
		query = query.Where("status = ?", status)
	}
	if typeM, ok := params["type"].(models.MeetType); ok {
		query = query.Where("type = ?", typeM)
	}
	if public, ok := params["public"].(bool); ok {
		query = query.Where("public = ?", public)
	}

	err := query.Preload("Participants").Find(&meets).Error
	return meets, err
}

func (r *meetRepository) Update(meet *models.Meet) error {
	return r.db.Save(meet).Error
}

func (r *meetRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Meet{}, id).Error
}

func (r *meetRepository) GetActiveByTimeRange(start, end time.Time) ([]models.Meet, error) {
	var meets []models.Meet
	err := r.db.Where("status = ? AND start_time BETWEEN ? AND ?", models.MeetActive, start, end).
		Preload("Participants").
		Find(&meets).Error
	return meets, err
}

func (r *meetRepository) GetByOrganizationID(orgID uuid.UUID) ([]models.Meet, error) {
	var meets []models.Meet
	err := r.db.Where("? = ANY(organization_ids)", orgID).
		Preload("Participants").
		Find(&meets).Error
	return meets, err
}

func (r *meetRepository) GetByCreator(creatorID uuid.UUID) ([]models.Meet, error) {
	var meets []models.Meet
	err := r.db.Where("creator = ?", creatorID).
		Preload("Participants").
		Find(&meets).Error
	return meets, err
}

func (r *meetRepository) GetUpcomingMeets() ([]models.Meet, error) {
	var meets []models.Meet
	now := time.Now()
	err := r.db.Where("start_time > ? AND status = ?", now, models.MeetActive).
		Preload("Participants").
		Order("start_time ASC").
		Find(&meets).Error
	return meets, err
}

func (r *meetRepository) AddParticipant(meetID uuid.UUID, userID uuid.UUID) error {
	return r.db.Exec("INSERT INTO user_participant (meet_id, user_id) VALUES (?, ?)", meetID, userID).Error
}

func (r *meetRepository) RemoveParticipant(meetID uuid.UUID, userID uuid.UUID) error {
	return r.db.Exec("DELETE FROM user_participant WHERE meet_id = ? AND user_id = ?", meetID, userID).Error
}

func (r *meetRepository) GetParticipants(meetID uuid.UUID) ([]*models.User, error) {
	var meet models.Meet
	err := r.db.Preload("Participants").First(&meet, meetID).Error
	if err != nil {
		return nil, err
	}
	return meet.Participants, nil
}

func (r *meetRepository) UpdateStatus(meetID uuid.UUID, status models.StatusMeet) error {
	return r.db.Model(&models.Meet{}).Where("id = ?", meetID).Update("status", status).Error
}

func (r *meetRepository) CreateOccurrence(occurrence *models.Occurrence) error {
	return r.db.Create(occurrence).Error
}

func (r *meetRepository) GetOccurrences(meetID uuid.UUID) ([]models.Occurrence, error) {
	var occurrences []models.Occurrence
	err := r.db.Where("meet_id = ?", meetID).Find(&occurrences).Error
	return occurrences, err
}
