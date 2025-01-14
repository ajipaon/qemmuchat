package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"qemmuChat/qemmu/models"

	"github.com/SherClockHolmes/webpush-go"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var (
	vapidPublicKey  = os.Getenv("VAPID_PUBLIC_KEY")
	vapidPrivateKey = os.Getenv("VAPID_PRIVATE_KEY")
	subscriptions   = []models.SubscriptionNotification{}
)

func NotificationRoute(g *echo.Group, dbLite *gorm.DB) {

	g.POST(":userId", func(c echo.Context) error {
		userId := c.Param("userId")
		var sub models.SubscriptionNotification
		if err := c.Bind(&sub); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid subscription"})
		}

		sub.UserID = userId
		if err := dbLite.Create(&sub).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to save subscription"})
		}

		return c.JSON(http.StatusCreated, map[string]string{"message": "Subscribed successfully"})
	})

	g.POST("/notify/:userId", func(c echo.Context) error {
		userId := c.Param("userId")
		notification := map[string]string{
			"title": "Hello!",
			"body":  "This is a personalized push notification.",
			"icon":  "/icon.png",
		}

		payload, _ := json.Marshal(notification)

		var subscriptions []models.SubscriptionNotification
		if err := dbLite.Where("user_id = ?", userId).Find(&subscriptions).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve subscriptions"})
		}

		for _, sub := range subscriptions {
			resp, err := webpush.SendNotification(payload, &webpush.Subscription{
				Endpoint: sub.Endpoint,
				Keys: webpush.Keys{
					P256dh: sub.P256dh,
					Auth:   sub.Auth,
				},
			}, &webpush.Options{
				TTL:             60,
				VAPIDPublicKey:  vapidPublicKey,
				VAPIDPrivateKey: vapidPrivateKey,
			})

			if err != nil {
				fmt.Printf("Failed to send notification to %s: %v\n", sub.Endpoint, err)
				continue
			}

			resp.Body.Close()
		}

		return c.JSON(http.StatusOK, map[string]string{"message": "Notifications sent"})
	})

}
