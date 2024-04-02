import styled from "@emotion/styled";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "../../routes";
import { Game } from "../../types";
import { SIDES } from "../../types/index";
import { DefaultButton } from "../buttons";
import { AIGameContent } from "./AIGameContent";
import { LocalContent } from "./LocalContent";
import { OnlineContent } from "./OnlineContent";

const Wrapper = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
`;

const ToggleTitle = styled(DialogContentText)`
  text-align: center;
  padding-bottom: 8px;
`;

const Content = styled(DialogContent)`
  display: flex;
  flex-direction: column;
`;

const ToggleGroup = styled(ToggleButtonGroup)`
  align-self: center;
`;

const Actions = styled(DialogActions)`
  margin-top: auto;
  padding: 16px;
`;

interface PreGameModalProps {
  game: Game;
}

enum MODES {
  ai = "ai",
  local = "local",
  online = "online",
}
const MODE_ROUTES = {
  [MODES.ai]: routes.ai,
  [MODES.local]: routes.local,
  [MODES.online]: routes.online,
};

export const PreGameModal = ({ game }: PreGameModalProps) => {
  const [mode, setMode] = useState(MODES.ai);
  const [side, setSide] = useState(SIDES.white);
  const navigate = useNavigate();

  useEffect(() => {
    const side = localStorage.getItem("side");
    if (side) {
      setSide(side as SIDES);
    }
  }, []);

  const handleChangeMode = (
    _: React.MouseEvent<HTMLElement>,
    newMode: MODES,
  ) => {
    setMode(newMode);
  };

  const handleChangeSide = (
    _: React.MouseEvent<HTMLElement>,
    newSide: SIDES,
  ) => {
    setSide(newSide);
    localStorage.setItem("side", newSide);
  };

  const startGame = () => {
    navigate(`${MODE_ROUTES[mode]}/${game.id}`);
  };

  return (
    <Wrapper>
      <DialogTitle variant="h4">Starting the game</DialogTitle>
      <Content>
        <ToggleTitle>Please choose game mode below</ToggleTitle>
        <ToggleGroup
          color="primary"
          value={mode}
          exclusive
          onChange={handleChangeMode}
          aria-label="Platform"
        >
          <ToggleButton value={MODES.ai}>Play with AI</ToggleButton>
          <ToggleButton value={MODES.online}>Play online</ToggleButton>
          <ToggleButton value={MODES.local}>Play locally</ToggleButton>
        </ToggleGroup>
        {mode === MODES.ai ? <AIGameContent /> : null}
        {mode === MODES.local ? <LocalContent /> : null}
        {mode === MODES.online ? <OnlineContent /> : null}
        {mode !== MODES.local ? (
          <>
            <ToggleTitle>Are you playing as White or Black?</ToggleTitle>
            <ToggleGroup
              color="primary"
              value={side}
              exclusive
              onChange={handleChangeSide}
              aria-label="Platform"
            >
              <ToggleButton value={SIDES.white}>White</ToggleButton>
              <ToggleButton value={SIDES.black}>Black</ToggleButton>
            </ToggleGroup>
          </>
        ) : null}
      </Content>
      <Actions>
        <DefaultButton onClick={startGame}>Start Game</DefaultButton>
      </Actions>
    </Wrapper>
  );
};
