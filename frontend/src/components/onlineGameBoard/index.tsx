import styled from "@emotion/styled";
import Snackbar from "@mui/material/Snackbar";
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

interface OnlineGameBoardProps {
  gameData: Game;
}

export const OnlineGameBoard = ({ gameData }: OnlineGameBoardProps) => {
  const [gamePosition, setGamePosition] = useState("");
  const game = useMemo(() => {
    const chess = new Chess();
    chess.loadPgn(gameData.PGN);
    setGamePosition(chess.fen());

    return chess;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [message, setMessage] = useState("");
  const mutation = useMutation((pgn: string) =>
    updateGame(gameData.id, gameData.name, pgn),
  );

  const handleClose = () => {
    setMessage("");
  };

  const setGamePositionWithSave = (newPos: string) => {
    setGamePosition(newPos);
    mutation.mutate(game.pgn());
  };

  const inviteFriend = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage("URL copied to clipboard. Send it to your friend");
  };

  return (
    <Wrapper>
      <Title3>Online game</Title3>
      <GameControls game={game} setGamePosition={setGamePosition} />
      <ButtonsWrapper>
        <DefaultButton
          style={{
            color: "black",
            backgroundColor: "#B58863",
          }}
          onClick={inviteFriend}
        >
          Invite Friend
        </DefaultButton>
      </ButtonsWrapper>
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePositionWithSave}
      />
      <Snackbar
        open={!!message}
        autoHideDuration={1000}
        onClose={handleClose}
        message={message}
      />
    </Wrapper>
  );
};
