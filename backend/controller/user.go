package controller

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"chess-backend/model"
)

var cookieLifetime = 3600 * 24 * 7 * 100
var domain = "http://localhost"

// TODO this needs to be replaced with proper authentication via auth provider
func IdentifyUser(c *gin.Context) {
	_, err := c.Cookie("user")
	if err != nil {
		// TODO add more domain here when deployed
		c.SetCookie("user", uuid.New().String(), cookieLifetime, "/", domain, false, false)
	}

	c.Next()
}

func PassUserSet(c *gin.Context) {
	c.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": "user set", "msg": "user set"})
}

func SetUserName(g *gin.Context) {
	var body model.PostUserName
	if err := g.ShouldBindJSON(&body); err == nil {
		if body.Name == "" {
			g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": "Name missing in body"})
			return
		}

		g.SetCookie("name", body.Name, cookieLifetime, "/", domain, false, false)
		g.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": "user name set", "msg": "user name set"})
	} else {
		log.Println(err)
		g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": err})
	}

}
