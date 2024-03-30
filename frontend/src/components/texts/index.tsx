import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode | string;
}

export const Title = ({ children }: TitleProps) => {
  return (
    <Typography variant="h3" component="h3">
      {children}
    </Typography>
  );
};

export const SubTitle = ({ children }: TitleProps) => {
  return (
    <Typography variant="h5" component="h5">
      {children}
    </Typography>
  );
};
