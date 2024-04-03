package controller

import (
	"bytes"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"chess-backend/model"
	"chess-backend/repository"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// TODO add real domain when hosted
		return true
	},
}

type OnlineController struct {
	DB *sql.DB
}

type OnlineControllerInterface interface {
	TransmitGameData(g *gin.Context)
}

func NewOnlineController(db *sql.DB) OnlineControllerInterface {
	return &OnlineController{DB: db}
}

var sessionGroupMap = make(map[string]model.ChannelData)

// @Summary Socket connection handler for online games
// @Description Receives different events related to online game
// @Param user cookie string true "User ID"
func (m *OnlineController) TransmitGameData(g *gin.Context) {
	wsSession, err := upgrader.Upgrade(g.Writer, g.Request, nil)
	if err != nil {
		log.Fatal(err)
	}

	uid := uuid.New()

	wsURL := g.Request.URL
	wsURLParam, err := url.ParseQuery(wsURL.RawQuery)

	if err != nil {
		wsSession.Close()
		log.Println(err)
	}

	if _, ok := wsURLParam["gameId"]; ok {
		gameId := wsURLParam["gameId"][0]
		log.Printf("A client connected to %s game", gameId)
		if _, ok := sessionGroupMap[gameId]; !ok {
			db := m.DB
			repo_game := repository.NewGameRepository(db)
			game, err := repo_game.FetchGame(gameId)
			if err != nil {
				log.Println(err)
				wsSession.Close()
				return
			}

			sessionGroupMap[gameId] = model.ChannelData{
				OwnerId:     game.OwnerId,
				Connections: map[uuid.UUID]*websocket.Conn{},
			}
		}
		sessionGroupMap[gameId].Connections[uid] = wsSession

		userId, err2 := g.Cookie("user")
		if err2 != nil {
			log.Println(err2)
		}
		userName, err3 := g.Cookie("name")
		if err3 != nil {
			log.Println(err3)
		}
		channel := sessionGroupMap[gameId]
		if channel.Participants == nil {
			channel.Participants = make(map[string]string)
		}
		channel.Participants[userId] = userName
		sessionGroupMap[gameId] = channel
		broadcast(gameId, getBoardDataReply(gameId))

		defer wsSession.Close()

		listen(m, wsSession, gameId, uid, userId)
	} else {
		err := wsSession.WriteJSON(map[string]string{"message": "missing gameId"})
		if err != nil {
			log.Println(err)
		}
		wsSession.Close()
	}
}

func listen(m *OnlineController, wsSession *websocket.Conn, gameId string, connUid uuid.UUID, userId string) {
	for {
		var msg model.Message
		err := wsSession.ReadJSON(&msg)
		if err != nil {
			wsSession.Close()
			delete(sessionGroupMap[gameId].Connections, connUid)
			delete(sessionGroupMap[gameId].Participants, userId)
			if websocket.IsCloseError(err, websocket.CloseGoingAway) {
				log.Printf("Client disconnected in %s", gameId)
			} else {
				log.Printf("Reading Error in %s. %s", gameId, err)
			}
			break // To escape from the endless loop
		}
		log.Printf("Received msg:%s in %s from %s", msg, gameId, userId)
		handleMessage(m, msg, gameId, connUid, userId)
	}
}

// TODO Ideally we need to document this communication protocol
func handleMessage(m *OnlineController, msg model.Message, gameId string, connUid uuid.UUID, userId string) {
	switch msg.Type {
	case "pgn":
		if userId == sessionGroupMap[gameId].Opponent || userId == sessionGroupMap[gameId].OwnerId {
			broadcast(gameId, msg)

			db := m.DB
			repo_game := repository.NewGameRepository(db)
			repo_game.UpdateGame(model.PostGameInput{PGN: msg.Data}, userId, gameId)
		}
	case "ownerSide":
		if userId == sessionGroupMap[gameId].OwnerId {
			channel := sessionGroupMap[gameId]
			channel.OwnerSide = msg.Data
			sessionGroupMap[gameId] = channel
			broadcast(gameId, getBoardDataReply(gameId))
		}
	case "opponentChosen":
		if userId == sessionGroupMap[gameId].OwnerId {
			channel := sessionGroupMap[gameId]
			channel.Opponent = msg.Data
			sessionGroupMap[gameId] = channel
			broadcast(gameId, getBoardDataReply(gameId))
		}
	case "getBoardData":
		reply(gameId, getBoardDataReply(gameId), connUid, userId)
	default:
		log.Printf("Unknown message type - %s.\n", msg.Type)
	}
}

func getBoardDataReply(gameId string) model.Message {
	channel := sessionGroupMap[gameId]

	participants := new(bytes.Buffer)
	for key, value := range channel.Participants {
		fmt.Fprintf(participants, "%s=%s;", key, value)
	}

	data := []string{channel.Opponent, channel.OwnerSide, participants.String()}
	return model.Message{
		Type: "boardData",
		Data: strings.Join(data, "|"),
	}
}

func reply(gameId string, msg model.Message, connUid uuid.UUID, userId string) {
	log.Printf("reply msg - %v to %s", msg, userId)
	wsSession := sessionGroupMap[gameId].Connections[connUid]
	err2 := wsSession.WriteJSON(msg)
	if err2 != nil {
		log.Println(err2)
	}
}

func broadcast(gameId string, msg model.Message) {
	log.Printf("broadcast msg - %v", msg)
	for _, wsSession := range sessionGroupMap[gameId].Connections {
		log.Printf("broadcast msg to wsSession - %v\n", msg)
		err := wsSession.WriteJSON(msg)
		if err != nil {
			log.Println(err)
		}
	}
}
