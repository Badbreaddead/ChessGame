package app

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"chess-backend/controller"
	"chess-backend/middleware"
)

type App struct {
	DB     *sql.DB
	Routes *gin.Engine
}

func (a *App) CreateConnection(){
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	a.DB = db
}

// TODO if one day it becomes wide spread app - socket connection for online games would be a dedicated service
// SSE or Sockets here
   
func (a *App) CreateRoutes() {
	router := gin.Default()

	// TODO add more domain here when deployed
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"PUT", "PATCH", "POST", "GET", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "Content-Length", "X-CSRF-Token", "Token", "session", "Origin", "Host", "Connection", "Accept-Encoding", "Accept-Language", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 24 * time.Hour,
    }))

	router.Use(middleware.IdentifyUser)

	mangaController := controller.NewMangaController(a.DB)
	gameController := controller.NewGameController(a.DB)
	router.GET("/games", gameController.GetGames)
	router.GET("/game/:gameId", gameController.GetGame)
	router.POST("/game", gameController.CreateGame)
	router.PATCH("/game/:gameId", gameController.UpdateGame)

	router.GET("/manga", mangaController.GetManga)
	router.POST("/manga", mangaController.InsertManga)
	a.Routes = router
}

func (a *App) Run(){
	a.Routes.Run(":8080")
}
