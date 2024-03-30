import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React, { ReactNode } from "react";

interface DefaultButtonProps {
  children: ReactNode | string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
}

const StyledButton = styled(Button)`
  cursor: pointer;
  padding: 10px 20px;
  margin: 10px 10px 0px 0px;
  borderradius: 6px;
  backgroundcolor: #f0d9b5;
  boxshadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  &:hover {
    color: black;
  }
`;

export const DefaultButton = ({
  children,
  onClick,
  style,
}: DefaultButtonProps) => {
  return (
    <StyledButton variant="contained" onClick={onClick} style={style}>
      {children}
    </StyledButton>
  );
};
