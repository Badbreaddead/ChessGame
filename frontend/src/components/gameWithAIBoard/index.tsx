import styled from "@emotion/styled";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";

import { DefaultButton } from "../buttons";
import { ChessBoard } from "../chessboard";
import { GameControls } from "../gameControls";
import { SubTitle, Title } from "../texts";
import Engine from "./stockfish/engine";

const Wrapper = styled.div`
  padding: 32px;
`;

const LevelsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const LEVELS = {
  "Easy 🤓": 2,
  "Medium 🧐": 8,
  "Hard 😵": 18,
};

export const GameWithAIBoard = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [stockfishLevel, setStockfishLevel] = useState(2);

  const [gamePosition, setGamePosition] = useState(game.fen());

  function findBestMove() {
    engine.evaluatePosition(game.fen());
    let moveMade = false;

    engine.onMessage(({ bestMove }) => {
      if (bestMove && !moveMade) {
        moveMade = true;
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setGamePosition(game.fen());
      }
    });
  }

  return (
    <Wrapper>
      <Title>Game With Chess Engine</Title>
      <SubTitle>
        Compete with Strong open source chess engine{" "}
        <a rel="noreferrer" target="_blank" href="https://stockfishchess.org/">
          Stockfish
        </a>
      </SubTitle>
      <GameControls game={game} setGamePosition={setGamePosition} type="AI" />
      <LevelsWrapper>
        {Object.entries(LEVELS).map(([level, depth]) => (
          <DefaultButton
            style={{
              color: "black",
              backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
            }}
            onClick={() => setStockfishLevel(depth)}
          >
            {level}
          </DefaultButton>
        ))}
      </LevelsWrapper>
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePosition}
        doAIMove={findBestMove}
      />
    </Wrapper>
  );
};
