import styled from "@emotion/styled";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";

import { ChessBoard } from "../chessboard";
import { GameControls } from "../gameControls";
import { SubTitle, Title } from "../texts";

const Wrapper = styled.div`
  padding: 32px;
`;

export const LocalGameBoard = () => {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());

  return (
    <Wrapper>
      <Title>Local game</Title>
      <SubTitle>
        Train your brain by playing with yourself or play with friend on this
        device
      </SubTitle>
      <GameControls game={game} setGamePosition={setGamePosition} />
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePosition}
      />
    </Wrapper>
  );
};
