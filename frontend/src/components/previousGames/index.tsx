import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useQuery } from "react-query";

import { fetchGames } from "../../api/game";
import { Game, ServerResponse } from "../../types/index";
import { sortByDates } from "../../utils/sort";
import { Error } from "../error";
import { Loading } from "../loading";
import { Title5 } from "../texts/index";
import { PreviousGame } from "./PreviousGame";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  lineHeight: "60px",
}));

interface PreviousGamesProps {
  onClick: (onClick: Game) => void;
}

export const PreviousGames = ({ onClick }: PreviousGamesProps) => {
  const { data, isLoading, error } = useQuery<ServerResponse<Game[]>>(
    "fetchGames",
    fetchGames,
  );

  const continueGame = (game: Game) => () => {
    onClick(game);
  };

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <>
      {data?.data ? (
        <>
          <Title5>Previous Games</Title5>
          <br />
          <Grid container spacing={4}>
            {data.data.sort(sortByDates<Game>("created")).map((game) => (
              <Grid key={game.id} item xs={12} sm={6} md={4} lg={3}>
                <Item elevation={5}>
                  <PreviousGame game={game} onClick={continueGame(game)} />
                </Item>
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
    </>
  );
};
