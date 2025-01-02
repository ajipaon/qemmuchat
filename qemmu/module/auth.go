package module

import (
	"fmt"
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

	t, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", err
	}

	return t, nil

}

func UpdateJwt(oldToken string) (string, error) {

	token, err := jwt.Parse(oldToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := newToken.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
