import styled from "@emotion/styled";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";

import { identifyUser } from "./api/user";
import { Error } from "./components/error";
import { getCookieValue } from "./utils/cookies";

const Wrapper = styled.div``;

const userId = getCookieValue("user");

export const AppLogic = () => {
  const { error } = useQuery("identifyUser", identifyUser, {
    enabled: !!userId,
  });

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};
