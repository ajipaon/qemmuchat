package config

import (
	"os"
	"qemmuChat/qemmu/models"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateJwt(user *models.Users) (string, error) {

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = user.Name
	claims["role"] = user.Role
	claims["id"] = user.ID
	claims["status"] = user.Status
	claims["firstlogin"] = user.FirstLogin
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(os.Getenv("ENV")))
	if err != nil {
		return "", err
	}

	return t, nil

}
