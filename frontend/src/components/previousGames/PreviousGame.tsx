import styled from "@emotion/styled";

import { Game } from "../../types/index";
import { formatDateTime, localDateTime } from "../../utils/datetime";
import { DefaultButton } from "../buttons";
import { BodyText, Title5 } from "../texts";

const Wrapper = styled.div`
  padding: 8px;
`;

interface PreviousGameProps {
  game: Game;
  onClick: () => void;
}

export const PreviousGame = ({ game, onClick }: PreviousGameProps) => {
  return (
    <Wrapper>
      <Title5 noOverflow>Game name: {game.name}</Title5>
      <BodyText>PGN format: {game.PGN}</BodyText>
      <BodyText>{formatDateTime(localDateTime(game.created))}</BodyText>
      <DefaultButton onClick={onClick}>Continue</DefaultButton>
    </Wrapper>
  );
};
