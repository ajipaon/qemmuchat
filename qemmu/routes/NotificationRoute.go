package routes

import (
	"errors"
	"net/http"
	"os"
	"qemmuChat/qemmu/models"

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
		existingSubscription.Endpoint = sub.Endpoint
		existingSubscription.P256dh = sub.Keys.P256dh
		existingSubscription.Auth = sub.Keys.Auth

		if err := dbLite.Save(&existingSubscription).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
		}
		return c.JSON(http.StatusCreated, map[string]string{"message": "Subscribed successfully"})
	})

}
