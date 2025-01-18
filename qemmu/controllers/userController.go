package controllers

import (
	"fmt"
	"net/http"
	"qemmuChat/qemmu/models"
	"qemmuChat/qemmu/module"
	"qemmuChat/qemmu/services"
	"strconv"

	"github.com/labstack/echo/v4"
)

type UserController struct {
	userService services.UserService
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

// GetUser godoc
// @Summary Get user
// @Description Retrieve a user
// @Tags user
// @Accept json
// @Produce json
// @Router /api/v1/user [get]
// @Security BearerAuth
func (h *UserController) GetUser(c echo.Context) error {
	userClaim := module.ReturnClaim(c)

	user := h.userService.GetUserAndOrganization(userClaim.Id)

	userResponse := module.ConvertUserResponse(user)

	return c.JSON(http.StatusOK, userResponse)

}

// ChangeOrganizaiton godoc
// @Summary ChangeOrganizaiton
// @Description Retrieve a user
// @Tags user
// @Accept json
// @Produce json
// @Param id path string true "Organization ID (UUID)"
// @Router /api/v1/user/change/organization/{id} [get]
// @Security BearerAuth
func (h *UserController) ChangeOrganization(c echo.Context) error {
	id := c.Param("id")
	user := module.ReturnClaim(c)

	userUpdate, err := h.userService.ChangeOrganization(user.Id, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	userResponse := module.ConvertUserResponse(userUpdate)

	token, err := module.GenerateJwt(userUpdate)

	c.Response().Header().Set("Authorization", fmt.Sprintf("Bearer %s", token))

	return c.JSON(http.StatusOK, map[string]interface{}{"message": "Organization Change", "data": userResponse})

}

// GetAllUser godoc
// @Summary GetAllUser
// @Description GetAllUser
// @Tags user
// @Accept json
// @Produce json
// @Param limit query integer true "limit"
// @Param page query integer true "page"
// @Param search query string false "search"
// @Router /api/v1/user/admin/all [get]
// @Security BearerAuth
func (h *UserController) GetAllUserAdmin(c echo.Context) error {
	userAuth := module.ReturnClaim(c)

	if userAuth.Role != string(models.RoleSuperAdmin) {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "user not allowed"})
	}
	search := c.QueryParam("search")
	pageParam := c.QueryParam("page")
	limitParam := c.QueryParam("limit")

	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit < 1 {
		limit = 10
	}

	users, total, err := h.userService.GetAllUsers(page, limit, search)
	totalPages := (total + limit - 1) / limit
	userResponse := module.ConvertUsersResponse(users)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Organization Change",
		"data":    userResponse,
		"pages": map[string]interface{}{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	})

}
