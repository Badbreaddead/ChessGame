import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import * as React from "react";

import { createOnlineSocket } from "../../api/online";
import { Game } from "../../types";
import { getCookieValue } from "../../utils/cookies";
import { DefaultButton } from "../buttons";
import { ChessBoard } from "../chessboard";
import { GameControls } from "../gameControls";
import { Title3 } from "../texts";

const Wrapper = styled.div`
  padding: 32px;
`;

const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
`;

const ParticipantRole = styled.div`
  display: flex;
  width: 72px;
  padding-right: 8px;
`;

const ParticipantsContainer = styled(FormControl)`
  padding-right: 24px;
`;

const ParticipantsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

interface OnlineGameBoardProps {
  gameData: Game;
}

export const OnlineGameBoard = ({ gameData }: OnlineGameBoardProps) => {
  const [gamePosition, setGamePosition] = useState("");
  const [message, setMessage] = useState("");
  const [ownerSide, setOwnerSide] = useState<"white" | "black">("white");
  const [opponent, setOpponent] = useState("");
  const [participants, setParticipants] = useState<[string, string][]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const game = useMemo(() => {
    const chess = new Chess();
    chess.loadPgn(gameData.PGN);
    setGamePosition(chess.fen());

    return chess;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userId = getCookieValue("user");
  const isOwner = gameData.ownerId === userId;
  const isOpponent = opponent === userId;

  // maybe worth isolating sockets logic to the dedicated hook
  useEffect(() => {
    if (socket) {
      socket.close();
    }

    const webSocket = createOnlineSocket(gameData.id);
    webSocket.onopen = () => {
      setSocket(webSocket);
      if (isOwner) {
        const chosenSide = localStorage.getItem("side") || "white";
        webSocket.send(JSON.stringify({ type: "ownerSide", data: chosenSide }));
      } else {
        webSocket.send(JSON.stringify({ type: "getBoardData" }));
      }
    };
    webSocket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.info("sockets event", eventData);
      switch (eventData.type) {
        case "pgn":
          game.loadPgn(eventData.data);
          setGamePositionWithSave(game.fen());
          break;
        case "boardData":
          const [oppo, ownSide, participantsStr] = eventData.data.split("|");
          const parts = participantsStr.split(";");
          parts.pop();
          setOpponent(oppo);
          setOwnerSide(ownSide);
          setParticipants(parts.map((part: string) => part.split("=")));
          break;
        default:
          console.error(
            "Unknown event type from online game socket connection",
            eventData,
          );
          break;
      }
    };
    webSocket.onclose = () => {
      setMessage(
        "Connection with the server was interrupted. Please reload the page.",
      );
    };

    return () => {
      webSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData.id]);

  const handleClose = () => {
    setMessage("");
  };

  const setGamePositionWithSave = (newPos: string) => {
    setGamePosition(newPos);
    socket?.send(JSON.stringify({ type: "pgn", data: game.pgn() }));
  };

  const inviteFriend = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage("URL copied to clipboard. Send it to your friend");
  };

  const canMove = () => {
    debugger;
    if (!isOwner && !isOpponent) {
      setMessage(
        "You are not playing... Ask game creator to promote you to player",
      );
      return false;
    }
    const isOwnerMove = isOwner && game.turn() === ownerSide[0];
    const isOpponentMove = isOpponent && game.turn() !== ownerSide[0];
    if (!(isOwnerMove || isOpponentMove)) {
      setMessage("It is not your turn");
    }

    return isOwnerMove || isOpponentMove;
  };

  const chooseOpponent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isOwner) {
      setOpponent(event.target.value);
      socket?.send(
        JSON.stringify({ type: "opponentChosen", data: event.target.value }),
      );
    }
  };

  const boardOrientation: "white" | "black" =
    (isOwner && ownerSide) ||
    (isOpponent && ownerSide === "white" ? "black" : "white") ||
    "white";

  return (
    <Wrapper>
      <Title3>Online game</Title3>
      {isOwner && (
        <>
          <GameControls game={game} setGamePosition={setGamePosition} />
          <ParticipantsWrapper>
            <br />
            <ParticipantsContainer>
              <ParticipantRow>
                <ParticipantRole>Role</ParticipantRole>
                <FormLabel id="demo-radio-buttons-group-label">
                  Nickname
                </FormLabel>
              </ParticipantRow>
              {participants.map((participant) => (
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={opponent}
                  onChange={chooseOpponent}
                  key={participant[0]}
                >
                  <ParticipantRow>
                    <ParticipantRole>
                      {participant[0] === opponent
                        ? "opponent"
                        : participant[0] === userId
                          ? "me"
                          : "viewer"}
                    </ParticipantRole>
                    <FormControlLabel
                      value={participant[0]}
                      control={<Radio disabled={participant[0] === userId} />}
                      label={participant[1]}
                    />
                  </ParticipantRow>
                </RadioGroup>
              ))}
            </ParticipantsContainer>
            <DefaultButton
              style={{
                color: "black",
                backgroundColor: "#B58863",
              }}
              onClick={inviteFriend}
            >
              Invite Friend
            </DefaultButton>
          </ParticipantsWrapper>
        </>
      )}
      <ChessBoard
        game={game}
        gamePosition={gamePosition}
        setGamePosition={setGamePositionWithSave}
        canMove={canMove}
        boardOrientation={boardOrientation}
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
