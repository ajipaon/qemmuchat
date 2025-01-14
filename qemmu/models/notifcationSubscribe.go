package models

type SubscriptionNotification struct {
	ID       uint   `gorm:"primaryKey;autoIncrement" json:"-"`
	UserID   string `gorm:"index;not null;unique" json:"userId"`
	Endpoint string `gorm:"not null" json:"endpoint"`
	P256dh   string `gorm:"not null" json:"p256dh"`
	Auth     string `gorm:"not null" json:"auth"`
}
