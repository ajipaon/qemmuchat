package controllers

import (
	"net/http"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/services"

	"github.com/labstack/echo/v4"
)

type UserController struct {
	userService services.UserService
}

func NewUserController(userService services.UserService) *UserController {
	return &UserController{userService}
}

// GetAllUser godoc
// @Summary GetUser
// @Description GetUser
// @Tags user
// @Accept json
// @Produce json
// @Router /api/v1/user/all [get]
// @Security BearerAuth
func (h *UserController) GetAllUser(c echo.Context) error {
	user := module.ReturnClaim(c)
	// page := c.Param("page")
	// size := c.Param("size")

	return c.JSON(http.StatusOK, user)

}

// GetUserByID godoc
// @Summary Get user by ID
// @Description Retrieve a user by their UUID
// @Tags user
// @Accept json
// @Produce json
// @Param id path string true "User ID (UUID)"
// @Router /api/v1/user/{id} [get]
// @Security BearerAuth
func (h *UserController) GetUserByID(c echo.Context) error {
	id := c.Param("id")

	user, err := h.userService.GetUserByID(id)

	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, user)

}

// GetUserByID godoc
// @Summary Get user by ID
// @Description Retrieve a user by their UUID
// @Tags user
// @Accept json
// @Produce json
// @Param id path string true "User ID (UUID)"
// @Router /api/v1/user/{id} [get]
// @Security BearerAuth
func (h *UserController) GetUser(c echo.Context) error {
	userClaim := module.ReturnClaim(c)

	user, err := h.userService.GetUserByID(userClaim.Id)

	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, user)

}
