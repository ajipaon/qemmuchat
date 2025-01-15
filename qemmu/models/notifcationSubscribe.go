package models

type SubscriptionNotification struct {
	ID       uint   `gorm:"primaryKey;autoIncrement" json:"-"`
	UserID   string `gorm:"index;not null;unique" json:"userId"`
	Endpoint string `gorm:"not null" json:"endpoint"`
	P256dh   string `gorm:"not null" json:"p256dh"`
	Auth     string `gorm:"not null" json:"auth"`
}

type SubscriptionKeys struct {
	P256dh string `json:"p256dh"`
	Auth   string `json:"auth"`
}

type SubscriptionPayload struct {
	Endpoint       string           `json:"endpoint"`
	ExpirationTime *string          `json:"expirationTime"` // Optional, bisa null
	Keys           SubscriptionKeys `json:"keys"`
}
