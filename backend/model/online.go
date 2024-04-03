package model

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type ChannelData struct {
	Connections map[uuid.UUID]*websocket.Conn
	OwnerId string
	OwnerSide string
	Opponent string
	Participants map[string]string
}

type Message struct {
	Type string    `json:"type"`
	Data string	   `json:"data"`
}