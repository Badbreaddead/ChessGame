import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { useMutation } from "react-query";

import { createGame } from "../api/game/index";
import { PreGameModal } from "../components/PreGameModal/index";
import { DefaultButton } from "../components/buttons";
import { PreviousGames } from "../components/previousGames";
import { Title3 } from "../components/texts";
import { Game } from "../types";

const Wrapper = styled.div`
  padding: 32px;
`;

const PlayButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 32px;
`;

export const Root = () => {
  const [chosenGame, setChosenGame] = useState<Game | undefined>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [createGameModal, setCreateGameModal] = useState(false);
  const [gameName, setGameName] = useState("");
  const [nameError, setNameError] = useState(false);

  const mutation = useMutation((name: string) => createGame(name, ""), {
    onSuccess: (data) => {
      setChosenGame(data.data);
    },
  });

  const startNewGame = () => {
    setCreateGameModal(true);
  };

  const createGameHandler = () => {
    if (!gameName) {
      setNameError(true);
    } else {
      mutation.mutate(gameName);
    }
  };

  const chooseGame = (game?: Game) => {
    setChosenGame(game);
  };

  const handleClose = () => {
    setChosenGame(undefined);
  };

  const handleCloseCreateModal = () => {
    setCreateGameModal(false);
  };

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setGameName(event.target.value);
  };

  return (
    <Wrapper>
      <Title3>Chess time!</Title3>
      <PlayButtons>
        <DefaultButton onClick={startNewGame}>Start a New Game</DefaultButton>
      </PlayButtons>
      <Dialog open={createGameModal} onClose={handleCloseCreateModal}>
        <DialogTitle>{"Create new game"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the game name to continue
          </DialogContentText>
          <br />
          <TextField
            autoFocus
            label="Game Name"
            error={nameError}
            helperText={nameError && "Provide game name"}
            value={gameName}
            onChange={handleGameName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancel</Button>
          <Button onClick={createGameHandler}>Start</Button>
        </DialogActions>
      </Dialog>
      <PreviousGames onClick={chooseGame} />
      <Dialog
        fullScreen={fullScreen}
        open={!!chosenGame}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {!!chosenGame ? <PreGameModal game={chosenGame} /> : null}
      </Dialog>
    </Wrapper>
  );
};
