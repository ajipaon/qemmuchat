package services

import (
	"fmt"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/repository"
	"time"
)

type ActivityService struct {
	activityRepository repository.ActivityRepository
}

func (s *ActivityService) UpdateActivity(activityRequest models.ActivityUpdateRequst) {

	userActivity, err := s.activityRepository.GetById(activityRequest.UserID)

	if err != nil {
		userActivity.UserID = activityRequest.UserID
	}

	switch activityRequest.LatActivityPlatform {
	case models.WebPlatform:
		userActivity.LastActivityWeb = time.Now()
	case models.AppPlatform:
		userActivity.LastActivityApp = time.Now()
	default:
		fmt.Println("no platform time update")
	}
	userActivity.LastActivityNetwork = time.Now()
	userActivity.LastActivityPage = activityRequest.LastActivityPage
	userActivity.LatCurrentActivity = time.Now()
	if activityRequest.LastActivityId != "" {

		userActivity.LastActivityId = activityRequest.LastActivityId
	}

	s.activityRepository.Update(userActivity)

}
