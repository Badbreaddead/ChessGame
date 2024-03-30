import styled from "@emotion/styled";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DefaultButton } from "../components/buttons";
import { ChessBoard } from "../components/chessboard";
import { GameControls } from "../components/gameControls";
import { SubTitle, Title } from "../components/texts";
import { routes } from "../routes";

const Wrapper = styled.div`
  padding: 32px;
`;

const PlayButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
`;

let index = 1;

export const Root = () => {
  const navigate = useNavigate();
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());

  const handleClick = (route: string) => {
    navigate(`${route}/${index}`);
    index += 1;
  };

  return (
    <Wrapper>
      <Title>Chess time!</Title>
      <PlayButtons>
        <DefaultButton onClick={() => handleClick(routes.ai)}>
          Play with computer
        </DefaultButton>
        <DefaultButton onClick={() => handleClick(routes.online)}>
          Play with friend online
        </DefaultButton>
        <DefaultButton onClick={() => handleClick(routes.local)}>
          Play with yourself
        </DefaultButton>
      </PlayButtons>
      <SubTitle>or practice here</SubTitle>
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePosition}
      />
      <br />
      <GameControls
        game={game}
        setGamePosition={setGamePosition}
        type="mainPage"
      />
    </Wrapper>
  );
};
