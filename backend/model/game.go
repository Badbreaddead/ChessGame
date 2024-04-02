package model

type Game struct {
	Id uint        `json:"id" binding:"required"`
	OwnerId string `json:"ownerId" binding:"required"`
	Name string    `json:"name"`
	PGN string     `json:"PGN"`
	Created string `json:"created"`
}

type PostGameInput struct {
	Name string `json:"name"`
	PGN string  `json:"PGN"`
}
