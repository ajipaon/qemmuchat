package controllers

import (
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"github.com/ajipaon/qemmuChat/qemmu/module"
	"github.com/ajipaon/qemmuChat/qemmu/services"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ActivityController struct {
	activityService services.ActivityService
}

// heartBeat godoc
// @Summary update user Activiy
// @Description update user Activiy
// @Tags activity
// @Param platform query string false "Platform of the activity (e.g., web, app)"
// @Param page query string false "Page name or section the user is interacting with"
// @Param id query string false "page Id like chatId or chat group"
// @Router /api/v1/activity/heartbeat [get]
// @Security BearerAuth
func (h *ActivityController) ActivityHeartbeat(c echo.Context) error {
	user := module.ReturnClaim(c)
	platform := c.QueryParam("platform")
	pageActivity := c.QueryParam("page")
	pageActivityId := c.QueryParam("id")

	var activityUpdateRequst models.ActivityUpdateRequst

	activityUpdateRequst.UserID = uuid.MustParse(user.Id)

	switch platform {
	case string(models.WebPlatform):
		activityUpdateRequst.LatActivityPlatform = models.WebPlatform
	case string(models.AppPlatform):
		activityUpdateRequst.LatActivityPlatform = models.AppPlatform
	default:
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": fmt.Sprintf("Parameter '%s' does not exist", platform),
		})
	}

	if pageActivity != "" {
		activityUpdateRequst.LastActivityPage = string(pageActivity)
	}
	if pageActivityId != "" {
		activityUpdateRequst.LastActivityId = pageActivityId
	}

	go h.activityService.UpdateActivity(activityUpdateRequst)

	return c.JSON(http.StatusOK, map[string]interface{}{"message": "ok"})

}

// activitytest godoc
// @Summary update user Activiy
// @Description update user Activiy
// @Tags activity
// @Param platform query string false "Platform of the activity (e.g., web, app)"
// @Router /api/v1/activity/test [get]
// @Security BearerAuth
func (h *ActivityController) Activitytest(c echo.Context) error {

	platform := c.QueryParam("platform")

	broker := models.NewBroker()
	broker.Publish(platform, "rwerwerw")

	return c.JSON(http.StatusOK, map[string]interface{}{"message": "ok"})

}
