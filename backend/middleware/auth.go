package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// TODO this needs to be replaced with proper authentication via auth provider
func IdentifyUser(c *gin.Context) {
	_, err := c.Cookie("user")
	if err != nil {
		// TODO add more domain here when deployed
		c.SetCookie("user", uuid.New().String(), 3600 * 24 * 7, "/", "http://localhost", true, true)
	}

	c.Next()
}