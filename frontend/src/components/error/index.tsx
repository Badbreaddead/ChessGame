import Typography from "@mui/material/Typography";

interface ErrorProps {
  error: string | {};
}

export const Error = ({ error }: ErrorProps) => {
  return (
    <Typography variant="h2" component="h2">
      {String(error)}
    </Typography>
  );
};
