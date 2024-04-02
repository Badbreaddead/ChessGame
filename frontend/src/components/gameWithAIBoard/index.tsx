import styled from "@emotion/styled";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";

import { updateGame } from "../../api/game/index";
import { Game } from "../../types";
import { DefaultButton } from "../buttons";
import { ChessBoard } from "../chessboard";
import { GameControls } from "../gameControls";
import { Title3 } from "../texts";
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

interface GameWithAIBoardProps {
  gameData: Game;
}

export const GameWithAIBoard = ({ gameData }: GameWithAIBoardProps) => {
  const [gamePosition, setGamePosition] = useState("");
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => {
    const chess = new Chess();
    chess.loadPgn(gameData.PGN);
    setGamePosition(chess.fen());

    return chess;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const mutation = useMutation((pgn: string) =>
    updateGame(gameData.id, gameData.name, pgn),
  );

  useEffect(() => {
    // make AI do first move if it is his turn
    const side = localStorage.getItem("side");
    if (side && game.turn() !== side[0]) {
      findBestMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGamePositionWithSave = (newPos: string) => {
    setGamePosition(newPos);
    mutation.mutate(game.pgn());
  };

  const findBestMove = () => {
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

        setGamePositionWithSave(game.fen());
      }
    });
  };

  return (
    <Wrapper>
      <Title3 noOverflow>
        Game With{" "}
        <a rel="noreferrer" target="_blank" href="https://stockfishchess.org/">
          Stockfish
        </a>
        : {gameData.name}
      </Title3>
      <GameControls
        game={game}
        setGamePosition={setGamePositionWithSave}
        type="AI"
      />
      <LevelsWrapper>
        {Object.entries(LEVELS).map(([level, depth]) => (
          <DefaultButton
            key={level}
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
