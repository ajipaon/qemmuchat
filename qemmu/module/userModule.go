package module

import (
	"qemmuChat/qemmu/models"
)

func ConvertUserResponse(user *models.Users) models.LoginUserResponse {
	return models.LoginUserResponse{
		Name:       user.Name,
		Image:      user.Image,
		FirstLogin: user.FirstLogin,
		Status:     string(user.Status),
		Email:      user.Email,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
		Role:       string(user.Role),
	}
}
