package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"qemmuChat/qemmu/models"

	"github.com/SherClockHolmes/webpush-go"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var (
	subscriptions = []models.SubscriptionNotification{}
)

func NotificationRoute(g *echo.Group, dbLite *gorm.DB) {

	g.GET("/key", func(c echo.Context) error {
		vapidPublicKey := os.Getenv("VAPID_PUBLIC_KEY")
		return c.JSON(http.StatusOK, map[string]string{"message": "success", "data": vapidPublicKey})
	})

	g.POST("/:userId", func(c echo.Context) error {
		userId := c.Param("userId")
		var sub models.SubscriptionPayload
		if err := c.Bind(&sub); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
		}

		subscription := models.SubscriptionNotification{
			UserID:   userId,
			Endpoint: sub.Endpoint,
			P256dh:   sub.Keys.P256dh,
			Auth:     sub.Keys.Auth,
		}

		var existingSubscription models.SubscriptionNotification

		err := dbLite.Where("user_id = ?", userId).First(&existingSubscription).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				if err := dbLite.Create(&subscription).Error; err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
				}
				return c.JSON(http.StatusOK, map[string]string{"message": "Subscription created"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
		}

		existingSubscription.P256dh = sub.Keys.P256dh
		existingSubscription.Auth = sub.Keys.Auth

		if err := dbLite.Save(&existingSubscription).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
		}
		return c.JSON(http.StatusCreated, map[string]string{"message": "Subscribed successfully"})
	})

	g.POST("/notify/:userId", func(c echo.Context) error {
		userId := c.Param("userId")
		notification := map[string]string{
			"title": "Hello!",
			"body":  "zuzume yasasi, sukin.",
			"icon":  "/icon.png",
		}

		vapidPublicKey := os.Getenv("VAPID_PUBLIC_KEY")
		vapidPrivateKey := os.Getenv("VAPID_PRIVATE_KEY")
		payload, _ := json.Marshal(notification)

		var subscriptions models.SubscriptionNotification
		if err := dbLite.Where("user_id = ?", userId).First(&subscriptions).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve subscriptions"})
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

		return c.JSON(http.StatusOK, map[string]string{"message": "Notifications sent"})
	})

}
