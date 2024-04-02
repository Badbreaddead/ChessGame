export interface Game {
  id: string;
  ownerId: string;
  name: string;
  PGN: string;
  created: string;
}

export interface ServerResponse<Data> {
  msg: string;
  status: "success" | "error" | "failed";
  data?: Data;
}

export enum SIDES {
  white = "white",
  black = "black",
}
