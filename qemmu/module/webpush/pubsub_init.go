package webpush

import (
	"encoding/json"
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"os"

	"github.com/SherClockHolmes/webpush-go"
	"github.com/asaskevich/EventBus"
	"gorm.io/gorm"
)

type WebPushEventBus struct {
	bus EventBus.Bus
	db  *gorm.DB
}

var instance *WebPushEventBus

func GetInstanceWithDB(db *gorm.DB) *WebPushEventBus {
	if instance == nil {
		if db == nil {
			panic("Database connection is required during the first initialization of WebPushEventBus")
		}
		instance = &WebPushEventBus{
			bus: EventBus.New(),
			db:  db,
		}
	}

	if db != nil && instance.db == nil {
		instance.db = db
	}

	return instance
}

func (wp *WebPushEventBus) RegisterListeners() {
	bus := wp.bus

	bus.Subscribe("webpush:notification", func(targetId string, message models.NotificationWebPush) {

		vapidPublicKey := os.Getenv("VAPID_PUBLIC_KEY")
		vapidPrivateKey := os.Getenv("VAPID_PRIVATE_KEY")

		payload, _ := json.Marshal(message)

		var subscriptions models.SubscriptionNotification
		if err := wp.db.Where("user_id = ?", targetId).First(&subscriptions).Error; err != nil {
			fmt.Println(err.Error())
			return
		}

		resp, err := webpush.SendNotification(payload, &webpush.Subscription{
			Endpoint: subscriptions.Endpoint,
			Keys: webpush.Keys{
				P256dh: subscriptions.P256dh,
				Auth:   subscriptions.Auth,
			},
		}, &webpush.Options{
			TTL:             60,
			VAPIDPublicKey:  vapidPublicKey,
			VAPIDPrivateKey: vapidPrivateKey,
		})

		if err != nil {
			fmt.Printf("Failed to send notification to %s: %v\n", subscriptions.Endpoint, err)

		}

		resp.Body.Close()

	})
}

func (wp *WebPushEventBus) WebPushNotificationPublisher(targetId, title, message string) {

	notification := models.NotificationWebPush{
		Title: title,
		Body:  message,
		Icon:  "/vite.svg",
	}
	fmt.Println(notification)
	wp.bus.Publish("webpush:notification", targetId, notification)
}
