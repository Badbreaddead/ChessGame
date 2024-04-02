import styled from "@emotion/styled";

import { Title5 } from "../texts";

const Wrapper = styled.div`
  padding: 48px;
`;

export const AIGameContent = () => {
  return (
    <Wrapper>
      <Title5 align="center">
        Compete with Strong Open Source Chess Engine{" "}
        <a rel="noreferrer" target="_blank" href="https://stockfishchess.org/">
          Stockfish
        </a>
      </Title5>
    </Wrapper>
  );
};
