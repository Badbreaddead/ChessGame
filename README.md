# ChessGame

## Product overview

This project implements Chess web game. You can play in three modes: online, local and with chess Engine.

## Tech Stack overview

Backend is implemented based on [Gin Web Framework](https://github.com/gin-gonic/gin). It is basic RESTful API for local game + [socket communication](github.com/gorilla/websocket) for online games. Backend uses Postgres db to store games data.

Frontend is classic SPA based on React with TS via [create-react-app](https://create-react-app.dev/). Frontend uses [react-chessboard](https://github.com/Clariity/react-chessboard) as visual headless chess representation layer + [chess.js](https://github.com/jhlywa/chess.js/tree/master) for chess logic.

## How to run

Docker is half setup. You cannot unfortunately run everything with one command yet: I am working on it. But the setup process is nevertheless quite easy.

### Frontend

You would need node and npm installed. Go to frontend folder and run:

```
npm i
```

After installing dependencies you need to build project with

```
npm run build
```

### Backend

You would need installed postgres as we use this DB to store game data. First thing first you would need to create db with

```
bash backend/dbshell/db.sh YOUR_POSTGRES_USER YOUR_POSTGRES_PASSWORD
```

Check that chess_game db was created and move to next step - migration. You'll need to install https://github.com/golang-migrate/migrate CLI first. And run:

```
cd backend
make migration_up
```

Check that you have games table in the chess_game db. And we can run backend:

```
go run main.go
```

The app should be running on https://localhost. You would only need to accept unknown tls certificate
