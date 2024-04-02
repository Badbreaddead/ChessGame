import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Chess } from "chess.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "../../routes";
import { DefaultButton } from "../buttons";

const Wrapper = styled.div``;

const ControlButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
`;

interface GameControlsProps {
  game: Chess;
  setGamePosition: (gamePosition: string) => void;
  type?: "AI";
}

export const GameControls = ({
  game,
  setGamePosition,
  type,
}: GameControlsProps) => {
  const navigate = useNavigate();
  const [exitGameModal, setExitGameModal] = useState(false);
  const [resetGameModal, setResetGameModal] = useState(false);

  const openExitGameModal = () => {
    setExitGameModal(true);
  };

  const openResetGameModal = () => {
    setResetGameModal(true);
  };

  const handleCloseExitModal = () => {
    setExitGameModal(false);
  };

  const handleCloseResetModal = () => {
    setResetGameModal(false);
  };

  const exitGame = () => {
    navigate(routes.index);
  };

  const resetGame = () => {
    game.reset();
    setGamePosition(game.fen());
    setResetGameModal(false);
  };

  const undoLastMove = () => {
    game.undo();
    if (type === "AI") {
      game.undo();
    }
    setGamePosition(game.fen());
  };

  return (
    <Wrapper>
      <ControlButtons>
        <DefaultButton
          onClick={openExitGameModal}
          style={{ marginRight: "auto" }}
        >
          Exit The Game
        </DefaultButton>
        <DefaultButton onClick={openResetGameModal}>
          Reset The Game
        </DefaultButton>
        <DefaultButton onClick={undoLastMove}>Undo Last Move</DefaultButton>
      </ControlButtons>
      <Dialog
        open={exitGameModal}
        onClose={handleCloseExitModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Sure you want to exit this game?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All the progress is going to be lost
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExitModal}>Cancel</Button>
          <Button onClick={exitGame} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetGameModal} onClose={handleCloseResetModal}>
        <DialogTitle>{"Sure you want to reset this game?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All the progress is going to be lost
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetModal}>Cancel</Button>
          <Button onClick={resetGame} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
};
