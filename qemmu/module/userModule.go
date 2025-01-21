package module

import (
	"qemmuChat/qemmu/models"
)

func ConvertUserResponse(user *models.User) models.UserResponse {

	return models.UserResponse{
		Name:             user.Name,
		Image:            user.Image,
		FirstLogin:       user.FirstLogin,
		Status:           string(user.Status),
		Email:            user.Email,
		CreatedAt:        user.CreatedAt,
		UpdatedAt:        user.UpdatedAt,
		Role:             string(user.Role),
		Organizations:    user.Organizations,
		LastOrganization: user.LastOrganization,
	}
}

func ConvertUsersResponse(users []models.User) []models.UserResponse {
	responses := make([]models.UserResponse, 0, len(users))

	for _, user := range users {
		responses = append(responses, models.UserResponse{
			Id:               user.ID.String(),
			Name:             user.Name,
			Image:            user.Image,
			FirstLogin:       user.FirstLogin,
			Status:           string(user.Status),
			Email:            user.Email,
			CreatedAt:        user.CreatedAt,
			UpdatedAt:        user.UpdatedAt,
			Role:             string(user.Role),
			Organizations:    user.Organizations,
			LastOrganization: user.LastOrganization,
			Activity: models.ActivityResponse{
				ID:                  int(user.Activity.ID),
				CreatedAt:           user.Activity.CreatedAt,
				UpdatedAt:           user.Activity.UpdatedAt,
				DeletedAt:           user.Activity.DeletedAt,
				LastCurrentActivity: user.Activity.LatCurrentActivity,
				LastActivityNetwork: user.Activity.LastActivityNetwork,
				LastActivityApp:     user.Activity.LastActivityApp,
				LastActivityWeb:     user.Activity.LastActivityWeb,
				LastActivityId:      user.Activity.LastActivityId,
			},
		})
	}

	return responses
}
