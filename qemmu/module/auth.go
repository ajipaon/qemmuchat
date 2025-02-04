package module

import (
	"errors"
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type JwtCustomClaims struct {
	Name             string            `json:"name"`
	Role             models.Role       `json:"role"`
	Id               uuid.UUID         `json:"id"`
	Status           models.UserStatus `json:"status"`
	FirstLogin       bool              `json:"first_login"`
	LastOrganization string            `json:"last_organization"`
	jwt.RegisteredClaims
}

type ClaimData struct {
	Name             string
	Role             string
	Id               string
	Status           string
	FirstLogin       bool
	LastOrganization string
}

func GenerateJwt(user *models.User) (string, error) {

	claims := &JwtCustomClaims{
		Name:             user.Name,
		Role:             user.Role,
		Id:               user.ID,
		Status:           user.Status,
		FirstLogin:       user.FirstLogin,
		LastOrganization: user.LastOrganization,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

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

func ValidateJWT(tokenString string) (*JwtCustomClaims, error) {
	claims := &JwtCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return os.Getenv("SECRET"), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token tidak valid")
	}

	return claims, nil
}

func ReturnClaim(c echo.Context) ClaimData {

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JwtCustomClaims)

	return ClaimData{
		Name:             claims.Name,
		Role:             string(claims.Role),
		Id:               claims.Id.String(),
		Status:           string(claims.Status),
		FirstLogin:       claims.FirstLogin,
		LastOrganization: claims.LastOrganization,
	}
}
