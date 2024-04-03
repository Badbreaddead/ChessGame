package repository

import (
	"database/sql"
	"fmt"
	"log"

	"chess-backend/model"
)

type GameRepository struct {
	DB *sql.DB
}

type GameRepositoryInterface interface {
	FetchGames(userId string) (*[]model.Game, *model.APIError)
	FetchGame(gameId string) (*model.Game, *model.APIError)
	CreateGame(game model.PostGameInput, userId string) (*model.Game, *model.APIError)
	UpdateGame(game model.PostGameInput, userId string, gameId string) (*model.Game, *model.APIError)
}

func NewGameRepository(db *sql.DB) GameRepositoryInterface {
	return &GameRepository{DB: db}
}

func (m *GameRepository) CreateGame(gameInput model.PostGameInput, userId string) (*model.Game, *model.APIError) {
	var game model.Game
	stmt, err := m.DB.Prepare("INSERT INTO games (ownerId, name, pgn) VALUES ($1, $2, $3) RETURNING *;")
	if err != nil {
		log.Println(err)
		return &game, model.ErrDatabase(fmt.Sprintf("userId %s, gameInput %s: %s", userId, gameInput, err))
	}
	row := stmt.QueryRow(userId, gameInput.Name, gameInput.PGN)
	err2 := row.Scan(&game.Id, &game.OwnerId, &game.Name, &game.PGN, &game.Created)
	if err2 != nil {
		log.Println(err2)
		return &game, model.ErrDatabase(fmt.Sprintf("userId %s, gameInput %s: %s", userId, gameInput, err2))
	}
	return &game, nil
}

func (m *GameRepository) UpdateGame(gameInput model.PostGameInput, ownerId string, gameId string) (*model.Game, *model.APIError) {
	game, err := m.FetchGame(gameId)
	if err != nil {
		return nil, err
	}

	if game.OwnerId != ownerId {
		return nil, model.ErrClientInput(fmt.Sprintf("attempt to update the game %s of another owner by owner %s", gameId, ownerId))
	}

	sqlStatement := `
	UPDATE games
	SET name = $3, pgn = $4
	WHERE id = $1 AND ownerId = $2
	RETURNING *;
	`
	row := m.DB.QueryRow(sqlStatement, gameId, ownerId, gameInput.Name, gameInput.PGN)
	var updGame model.Game
	err2 := row.Scan(&updGame.Id, &updGame.OwnerId, &updGame.Name, &updGame.PGN, &updGame.Created)
	if err2 != nil {
		log.Println(err2)
		return nil, model.ErrDatabase(fmt.Sprintf("error updating game by id %s for ownerId %s: %v", gameId, ownerId, err2))
	}

	return &updGame, nil
}

func (m *GameRepository) FetchGames(ownerId string) (*[]model.Game, *model.APIError) {
	var result []model.Game

	rows, err := m.DB.Query(fmt.Sprintf("SELECT * FROM games WHERE ownerId = '%s'", ownerId))
	if err != nil {
		log.Println(err)
		return nil, model.ErrDatabase(fmt.Sprintf("error fetching games for ownerId %s: %v", ownerId, err))
	}

	for rows.Next() {
		var (
			id      uint
			ownerId string
			name    string
			pgn     string
			created string
		)
		err := rows.Scan(&id, &ownerId, &name, &pgn, &created)
		if err != nil {
			log.Println(err)
			return nil, model.ErrDatabase(fmt.Sprintf("error mapping games for ownerId %s: %v", ownerId, err))
		} else {
			game := model.Game{Id: id, OwnerId: ownerId, Name: name, PGN: pgn, Created: created}
			result = append(result, game)
		}
	}
	return &result, nil
}

func (m *GameRepository) FetchGame(gameId string) (*model.Game, *model.APIError) {
	row := m.DB.QueryRow("SELECT * FROM games WHERE id = $1", gameId)
	var game model.Game
	err := row.Scan(&game.Id, &game.OwnerId, &game.Name, &game.PGN, &game.Created)
	if err != nil {
		if err == sql.ErrNoRows {
			return &game, model.ErrClientInput(fmt.Sprintf("gameId %s: no such game", gameId))
		}
		log.Println(err)
		return &game, model.ErrDatabase(fmt.Sprintf("gameId %s: %v", gameId, err))
	}
	return &game, nil
}
