import styled from "@emotion/styled";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";
import { useMutation } from "react-query";

import { updateGame } from "../../api/game/index";
import { Game } from "../../types";
import { DefaultButton } from "../buttons";
import { ChessBoard } from "../chessboard";
import { GameControls } from "../gameControls";
import { Title3 } from "../texts";

const Wrapper = styled.div`
  padding: 32px;
`;

const ButtonsWrapper = styled.div``;

interface LocalGameBoardProps {
  gameData: Game;
}

export const LocalGameBoard = ({ gameData }: LocalGameBoardProps) => {
  const [gamePosition, setGamePosition] = useState("");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white",
  );
  const game = useMemo(() => {
    const chess = new Chess();
    chess.loadPgn(gameData.PGN);
    setGamePosition(chess.fen());

    return chess;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mutation = useMutation((pgn: string) =>
    updateGame(gameData.id, gameData.name, pgn),
  );

  const setGamePositionWithSave = (newPos: string) => {
    setGamePosition(newPos);
    mutation.mutate(game.pgn());
  };

  const invertBoard = () => {
    setBoardOrientation(boardOrientation === "white" ? "black" : "white");
  };

  return (
    <Wrapper>
      <Title3>Local game: {gameData.name}</Title3>
      <GameControls game={game} setGamePosition={setGamePositionWithSave} />
      <ButtonsWrapper>
        <DefaultButton
          style={{
            color: "black",
            backgroundColor: "#B58863",
          }}
          onClick={invertBoard}
        >
          Invert Board
        </DefaultButton>
      </ButtonsWrapper>
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePositionWithSave}
        boardOrientation={boardOrientation}
      />
    </Wrapper>
  );
};
