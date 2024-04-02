package controller

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"

	"chess-backend/model"
	"chess-backend/repository"
)

type GameController struct {
	DB *sql.DB
}

type GameControllerInterface interface {
	UpdateGame(g *gin.Context)
	CreateGame(g *gin.Context)
	GetGames(g *gin.Context)
	GetGame(g *gin.Context)
}

func NewGameController(db *sql.DB) GameControllerInterface {
	return &GameController{DB: db}
}

// @Summary Retrieve a list of games associated with the current user
// @Description Retrieve a list of games associated with the current user. It uses the user ID retrieved from the cookie to fetch the games.
// @Param user cookie string true "User ID"
// @Produce json
// @Success 200 {array} Game "Successfully retrieved games"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /games [get]
func (m *GameController) GetGames(g *gin.Context) {
	db := m.DB
	repo_game := repository.NewGameRepository(db)
	userId, err := g.Cookie("user")
	if err != nil {
		g.JSON(model.ResponseCodes[500], gin.H{"status": model.ResponseStatuses["error"], "msg": "Retriving user cookie error"})
		return
	}
	games, err2 := repo_game.FetchGames(userId)
	if err2 != nil {
		g.JSON(err2.Status, gin.H{"status": model.ResponseStatuses["error"], "data": err2, "msg": err2.Title})
	} else {
		g.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": games, "msg": "fetched games successfully"})
	}
}

// @Summary GetGame retrieves a single game based on the provided game ID.
// @Description Retrieve a single game based on the provided game ID. It uses the game ID from the query parameters to fetch the game.
// @Param gameId query int true "ID of the game to retrieve"
// @Produce json
// @Success 200 {object} Game "Successfully retrieved game"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /game [get]
func (m *GameController) GetGame(g *gin.Context) {
	db := m.DB
	repo_game := repository.NewGameRepository(db)
	gameId := g.Param("gameId")
	if gameId == "" {
		g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": "Query param gameId missing"})
		return
	}
	game, err := repo_game.FetchGame(gameId)
	if err != nil {
		g.JSON(err.Status, gin.H{"status": model.ResponseStatuses["error"], "data": err, "msg": err.Title})
	} else {
		g.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": game, "msg": "fetched game successfully"})
	}
}

// @Summary Create a new game using the provided game data
// @Description CreateGame creates a new game associated with the current user using the provided game data
// @Param user cookie string true "User ID"
// @Accept json
// @Produce json
// @Param body PostGameInput "Game object to create"
// @Success 200 {object} Game "Successfully created game"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /game [post]
func (m *GameController) CreateGame(g *gin.Context) {
	db := m.DB
	var body model.PostGameInput
	userId, err := g.Cookie("user")
	if err != nil {
		g.JSON(model.ResponseCodes[500], gin.H{"status": model.ResponseStatuses["error"], "msg": "Retriving user cookie error"})
		return
	}
	if err := g.ShouldBindJSON(&body); err == nil {
		if body.Name == "" {
			g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": "Name missing in body"})
			return
		}

		repo_game := repository.NewGameRepository(db)
		game, err2 := repo_game.CreateGame(body, userId)
		if err2 != nil {
			g.JSON(err2.Status, gin.H{"status": model.ResponseStatuses["error"], "data": err2, "msg": err2.Title})
		} else {
			g.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": game, "msg": "created game successfully"})
		}
	} else {
		log.Println(err)
		g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": err})
	}
}

// @Summary UpdateGame updates an existing game with the provided game data.
// @Description It expects the game details in the request body, the user ID from the cookie, and the game ID from the URL parameters.
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param gameId path int true "ID of the game to update"
// @Param user cookie string true "User ID"
// @Param body body PostGameInput true "Updated game object"
// @Success 200 {object} boolean "Successfully updated game"
// @Failure 400 {object} ErrorResponse "Bad request"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /game/{gameId} [put]
func (m *GameController) UpdateGame(g *gin.Context) {
	db := m.DB
	var body model.PostGameInput
	userId, err := g.Cookie("user")
	if err != nil {
		g.JSON(model.ResponseCodes[500], gin.H{"status": model.ResponseStatuses["error"], "msg": "Retriving user cookie error"})
		return
	}
	gameId := g.Param("gameId")
	if gameId == "" {
		g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": "URL param gameId missing"})
		return
	}

	if err := g.ShouldBindJSON(&body); err == nil {
		if body.Name == "" {
			g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": "Name missing in body"})
			return
		}
		repo_game := repository.NewGameRepository(db)
		updated, err2 := repo_game.UpdateGame(body, userId, gameId)
		if err2 != nil {
			g.JSON(err2.Status, gin.H{"status": model.ResponseStatuses["error"], "data": err2, "msg": err2.Title})
		} else {
			data := map[string]bool { 
				"updated": updated,
			}
			msg := "no rows affected"
			if updated {
				msg = "updated game"
			}
			g.JSON(model.ResponseCodes[200], gin.H{"status": model.ResponseStatuses["success"], "data": data, "msg": msg})
		}
	} else {
		log.Println(err)
		g.JSON(model.ResponseCodes[400], gin.H{"status": model.ResponseStatuses["failed"], "msg": err})
	}
}
