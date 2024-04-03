import { WEBSOCKET_ADDRESS } from "../config";

export const createOnlineSocket = (gameId: string) => {
  return new WebSocket(`${WEBSOCKET_ADDRESS}/online?gameId=${gameId}`);
};
