import { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { fetchGame } from "../../api/game";
import { Error } from "../../components/error";
import { GameWithAIBoard } from "../../components/gameWithAIBoard";
import { Loading } from "../../components/loading";
import { routes } from "../../routes";
import { Game, ServerResponse } from "../../types/index";

export const GameWithAI = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.gameId) {
      navigate(routes.index);
    }
  }, [params.gameId, navigate]);

  const { data, isLoading, error } = useQuery<ServerResponse<Game>>(
    "fetchGame",
    fetchGame(String(params.gameId)),
    { cacheTime: 0 },
  );

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading || !data?.data) {
    return <Loading />;
  }

  return (
    <div>
      <GameWithAIBoard gameData={data.data} />
    </div>
  );
};
