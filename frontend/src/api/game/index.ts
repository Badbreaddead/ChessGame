import { get, patch, post } from "../request";

export const updateGame = (gameId: string, name: string, pgn: string) => {
  return patch(`http://localhost:8080/game/${gameId}`, {
    body: JSON.stringify({ name, pgn }),
  });
};

export const createGame = (name: string, pgn: string) => {
  return post("http://localhost:8080/game", {
    body: JSON.stringify({ name, pgn }),
  });
};

export const fetchGames = () => {
  return get("http://localhost:8080/games");
};

export const fetchGame = (gameId: string) => () => {
  return get(`http://localhost:8080/game/${gameId}`);
};
