package webpush

import (
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/models"

	"github.com/SherClockHolmes/webpush-go"
	"gorm.io/gorm"
)

type VapidKeys struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	PublicKey  string `gorm:"not null" json:"public_key"`
	PrivateKey string `gorm:"not null" json:"private_key"`
}

type SessionData struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	SessionId string `gorm:"unique; not null" json:"session_id"`
	UserId    string `gorm:"not null" json:"user_id"`
	Data      string `gorm:"not null" json:"data"`
}

func AutoMigrate(db *gorm.DB) error {

	return db.AutoMigrate(&VapidKeys{}, &models.SubscriptionNotification{}, &SessionData{})
}

func getVapidKeys(db *gorm.DB) (*VapidKeys, error) {
	var keys VapidKeys
	result := db.First(&keys)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &keys, nil
}

func saveVapidKeys(db *gorm.DB, keys *VapidKeys) error {
	result := db.Create(keys)
	return result.Error
}

func InitVapidKeys(db *gorm.DB) (*VapidKeys, error) {

	keys, err := getVapidKeys(db)
	if err != nil {
		return nil, err
	}

	if keys != nil {
		fmt.Println("VAPID keys found in database.")
		return keys, nil
	}

	fmt.Println("Generating new VAPID keys...")
	PrivateKey, PublicKey, err := webpush.GenerateVAPIDKeys()
	if err != nil {
		return nil, err
	}

	keys = &VapidKeys{
		PublicKey:  PublicKey,
		PrivateKey: PrivateKey,
	}
	fmt.Println(keys)

	err = saveVapidKeys(db, keys)
	if err != nil {
		return nil, err
	}

	fmt.Println("New VAPID keys saved to database.")
	return keys, nil
}
