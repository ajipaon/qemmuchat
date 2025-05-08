package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StatusMeet string

const (
	MeetExpired StatusMeet = "EXPIRED"
	MeetActive  StatusMeet = "ACTIVE"
	MeetCancel  StatusMeet = "CANCEL"
)

type RepeatType string

const (
	MonthlyRepeatType RepeatType = "monthly"
	WeeklyRepeaType   RepeatType = "weekly"
	DailyRepeatType   RepeatType = "daily"
)

type MeetType string

const (
	OfflineMeetType MeetType = "online"
	OnlineMeetType  MeetType = "0ffline"
	HybridMeetType  MeetType = "hybrid"
)

type Meet struct {
	ID              uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4()"`
	Title           string         `json:"title"`
	Image           string         `json:"image"`
	Descriptions    string         `json:"descriptions"`
	Creator         uuid.UUID      `json:"creator"`
	Public          bool           `json:"public"`
	StartTime       time.Time      `json:"start_time"`
	EndTime         time.Time      `json:"end_time"`
	Type            MeetType       `json:"type"`
	Ongoing         bool           `json:"on_going" gorm:"default:false"`
	Repeat          bool           `json:"repeat"`
	RepeatAt        RepeatType     `json:"repeat_at"`
	RepeatUntil     time.Time      `json:"repeat_until"`
	Status          StatusMeet     `json:"status" gorm:"default:ACTIVE"`
	DeletedAt       gorm.DeletedAt `gorm:"index"`
	OrganizationIds []uuid.UUID    `json:"organization_ids" gorm:"type:uuid[]"`
	Participants    []*User        `json:"participant" gorm:"many2many:user_participant"`
	Occurrences     []Occurrence   `gorm:"foreignKey:MeetID"`
	PassCode        string         `json:"pass_code"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type Occurrence struct {
	gorm.Model
	MeetID    uuid.UUID `json:"meet_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
}

type MeetRequestDTO struct {
	Title           string      `json:"title" validate:"required"`
	Image           string      `json:"image" validate:"required,url"`
	Descriptions    string      `json:"descriptions" validate:"required"`
	Creator         uuid.UUID   `json:"creator" validate:"required"`
	Public          bool        `json:"public"`
	StartTime       time.Time   `json:"start_time" validate:"required"`
	EndTime         time.Time   `json:"end_time" validate:"required,gtfield=StartTime"`
	Type            MeetType    `json:"type" validate:"required,oneof=online 0ffline hybrid"`
	Repeat          bool        `json:"repeat"`
	RepeatAt        RepeatType  `json:"repeat_at" validate:"omitempty,oneof=monthly weekly daily"`
	RepeatUntil     time.Time   `json:"repeat_until" validate:"omitempty,gtfield=StartTime"`
	Status          StatusMeet  `json:"status" validate:"required,oneof=EXPIRED ACTIVE CANCEL"`
	OrganizationIds []uuid.UUID `json:"organization_ids" validate:"required,dive,required"`
	PassCode        string      `json:"pass_code" validate:"required_if=Public true,dive,required"`
}
