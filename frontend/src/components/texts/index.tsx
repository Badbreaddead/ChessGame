import Typography, { TypographyProps } from "@mui/material/Typography";
import { ReactNode } from "react";

interface TitleProps extends TypographyProps {
  children: ReactNode | string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  noOverflow?: boolean;
}

export const TextGeneric = ({
  children,
  align,
  noOverflow,
  ...props
}: TitleProps) => {
  let sx = {};
  if (noOverflow) {
    sx = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      ...sx,
    };
  }
  if (align === "center") {
    sx = {
      textAlign: "center",
      ...sx,
    };
  }
  // sx could have performance implications, consider switching to class in future
  return (
    <Typography sx={sx} {...props}>
      {children}
    </Typography>
  );
};

export const Title5 = ({ children, ...props }: TitleProps) => {
  return (
    <TextGeneric variant="h5" component="h5" {...props}>
      {children}
    </TextGeneric>
  );
};

export const Title3 = ({ children, ...props }: TitleProps) => {
  return (
    <TextGeneric variant="h3" component="h3" {...props}>
      {children}
    </TextGeneric>
  );
};

export const BodyText = ({ children, ...props }: TitleProps) => {
  return (
    <TextGeneric variant="body1" {...props}>
      {children}
    </TextGeneric>
  );
};
