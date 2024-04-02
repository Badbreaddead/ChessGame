import styled from "@emotion/styled";
import Snackbar from "@mui/material/Snackbar";
import { Chess, Square } from "chess.js";
import { ReactElement, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece } from "react-chessboard/dist/chessboard/types";

import { SIDES } from "../../types/index";

const CUSTOM_DARK_SQUARE_STYLE = {
  backgroundColor: "#865745",
  backgroundImage: 'url("wood-pattern.png")',
  backgroundSize: "cover",
};

const CUSTOM_LIGHT_SQUARE_STYLE = {
  backgroundColor: "#e0c094",
  backgroundImage: 'url("wood-pattern.png")',
  backgroundSize: "cover",
};

const BOARD_STYLE = {
  transform: "rotateX(27.5deg)",
  transformOrigin: "center",
  border: "16px solid #b8836f",
  borderStyle: "outset",
  borderRightColor: " #b27c67",
  borderRadius: "4px",
  boxShadow: "rgba(0, 0, 0, 0.5) 2px 24px 24px 8px",
  borderRightWidth: "2px",
  borderLeftWidth: "2px",
  borderTopWidth: "0px",
  borderBottomWidth: "18px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  padding: "8px 8px 12px",
  background: "#e0c094",
  backgroundImage: 'url("wood-pattern.png")',
  backgroundSize: "cover",
};

const PIECES = [
  { piece: "wP", pieceHeight: 1 },
  { piece: "wN", pieceHeight: 1.2 },
  { piece: "wB", pieceHeight: 1.2 },
  { piece: "wR", pieceHeight: 1.2 },
  { piece: "wQ", pieceHeight: 1.5 },
  { piece: "wK", pieceHeight: 1.6 },
  { piece: "bP", pieceHeight: 1 },
  { piece: "bN", pieceHeight: 1.2 },
  { piece: "bB", pieceHeight: 1.2 },
  { piece: "bR", pieceHeight: 1.2 },
  { piece: "bQ", pieceHeight: 1.5 },
  { piece: "bK", pieceHeight: 1.6 },
];

const TurnContainer = styled.div`
  position: absolute;
  left: 0;
  padding: 24px;
`;

const pieceComponents: {
  [key: string]: ({
    squareWidth,
    square,
  }: {
    squareWidth: any;
    square: Square;
  }) => ReactElement<any, any>;
} = {};

PIECES.forEach(({ piece, pieceHeight }) => {
  pieceComponents[piece] = ({ squareWidth }) => (
    <div
      style={{
        width: squareWidth,
        height: squareWidth,
        position: "relative",
        pointerEvents: "none",
      }}
    >
      <img
        src={`/images/3d-pieces/${piece}.webp`}
        alt={piece}
        width={squareWidth}
        height={pieceHeight * squareWidth}
        style={{
          position: "absolute",
          bottom: `${0.2 * squareWidth}px`,
          left: 0,
          objectFit: piece[1] === "K" ? "contain" : "cover",
        }}
      />
    </div>
  );
});

const Wrapper = styled.div`
  width: 70vw;
  max-width: 70vh;
  margin: 0 auto;
`;

interface ChessBoardProps {
  game: Chess;
  gamePosition: string;
  setGamePosition: (gamePosition: string) => void;
  doAIMove?: () => void;
  boardOrientation?: "white" | "black";
}

const TURNS = {
  w: "white",
  b: "black",
};

export const ChessBoard = ({
  game,
  gamePosition,
  setGamePosition,
  doAIMove,
  boardOrientation,
}: ChessBoardProps) => {
  const [message, setMessage] = useState("");
  const [activeSquare, setActiveSquare] = useState("");

  const handleClose = () => {
    setMessage("");
  };

  function onDrop(sourceSquare: Square, targetSquare: Square, piece: Piece) {
    const whosTurn = game.turn();
    const moveSide = piece[0];

    if (whosTurn !== moveSide) {
      setMessage("It is another side turn");
      return false;
    }

    try {
      game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() ?? "q",
      });

      setGamePosition(game.fen());

      if (game.isCheckmate()) {
        setMessage(`${game.turn() === "b" ? "White side" : "Black side"} won!`);
        return true;
      }
      if (game.isGameOver() || game.isDraw()) {
        setMessage("The game is finished");
        return false;
      }

      if (doAIMove) {
        doAIMove();
      }

      return true;
    } catch (error) {
      setMessage("Invalid move");
      return false;
    }
  }

  return (
    <Wrapper>
      <TurnContainer>Turn: {TURNS[game.turn()]}</TurnContainer>
      <Chessboard
        id="Styled3DBoard"
        position={gamePosition}
        onPieceDrop={onDrop}
        customBoardStyle={BOARD_STYLE}
        customPieces={pieceComponents}
        customLightSquareStyle={CUSTOM_LIGHT_SQUARE_STYLE}
        customDarkSquareStyle={CUSTOM_DARK_SQUARE_STYLE}
        animationDuration={500}
        customSquareStyles={{
          [activeSquare]: {
            boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
          },
        }}
        onMouseOverSquare={(sq) => setActiveSquare(sq)}
        onMouseOutSquare={(sq) => setActiveSquare("")}
        boardOrientation={
          boardOrientation || (localStorage.getItem("side") as SIDES) || "white"
        }
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
