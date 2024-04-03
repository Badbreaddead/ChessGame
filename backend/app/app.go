package app

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"chess-backend/controller"
)

type App struct {
	DB     *sql.DB
	Routes *gin.Engine
}

func (a *App) CreateConnection() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	a.DB = db
}

func (a *App) CreateRoutes() {
	router := gin.Default()

	// TODO add a domain here when deployed
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://localhost:3000"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "GET", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "Content-Length", "X-CSRF-Token", "Token", "session", "Origin", "Host", "Connection", "Accept-Encoding", "Accept-Language", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
	}))
	router.Use(controller.IdentifyUser)

	// serving RESTful endpoints
	rest := router.Group("/api")
	{
		gameController := controller.NewGameController(a.DB)
		rest.GET("/games", gameController.GetGames)
		rest.GET("/game/:gameId", gameController.GetGame)
		rest.POST("/game", gameController.CreateGame)
		rest.PATCH("/game/:gameId", gameController.UpdateGame)
		rest.Any("/user", controller.PassUserSet)
		rest.POST("/user/name", controller.SetUserName)
	}

	// serving Websockets connection for online games
	// if one day it becomes wide spread app we could isolate it to a dedicated service
	onlineController := controller.NewOnlineController(a.DB)
	router.Any("/online", onlineController.TransmitGameData)

	// serving static frontend files
	// if one day it becomes wide spread app we could isolate it to a dedicated service
	path := static.LocalFile("../frontend/build", true)
	router.Use(static.Serve("/", path))
	router.NoRoute(func(c *gin.Context) {
		c.File("../frontend/build/index.html")
	})
	a.Routes = router
}

func (a *App) Run() {
	// a.Routes.Run(":80")
	a.Routes.RunTLS(":443", "../tls/server.crt", "../tls/server.key")
}
