import { BACKEND_ADDRESS_API } from "../config";
import { get, patch, post } from "../request";

export const updateGame = (gameId: string, name: string, pgn: string) => {
  return patch(`${BACKEND_ADDRESS_API}/game/${gameId}`, {
    body: JSON.stringify({ name, pgn }),
  });
};

export const createGame = (name: string, pgn: string) => {
  return post(`${BACKEND_ADDRESS_API}/game`, {
    body: JSON.stringify({ name, pgn }),
  });
};

export const fetchGames = () => {
  return get(`${BACKEND_ADDRESS_API}/games`);
};

export const fetchGame = (gameId: string) => () => {
  return get(`${BACKEND_ADDRESS_API}/game/${gameId}`);
};
