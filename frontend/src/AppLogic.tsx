import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Outlet } from "react-router-dom";

import { identifyUser, setUserName } from "./api/user";
import { Error } from "./components/error";
import { Loading } from "./components/loading";
import { getCookieValue } from "./utils/cookies";

const Wrapper = styled.div``;

const userId = getCookieValue("user");
let userName = getCookieValue("name");

export const AppLogic = () => {
  const { error, isLoading } = useQuery("identifyUser", identifyUser, {
    enabled: !userId,
  });
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const mutation = useMutation(setUserName, {
    onSuccess: () => {
      userName = getCookieValue("name");
    },
  });

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setName(event.target.value);
  };

  const saveName = () => {
    if (!name) {
      setNameError(true);
    } else {
      mutation.mutate(name);
    }
  };

  return (
    <Wrapper>
      {userName ? (
        <Outlet />
      ) : (
        <>
          <Dialog open={true}>
            <DialogTitle>{"How can we call you?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please provide your name or nickname to continue
              </DialogContentText>
              <br />
              <TextField
                autoFocus
                label="Name"
                error={nameError}
                helperText={nameError && "Enter something"}
                value={name}
                onChange={handleGameName}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={saveName}>Let's go</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Wrapper>
  );
};
