import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";

import { AuthContext } from "../../context/auth";
import { useForm } from "../../util/hooks";

function LoginForm() {
  const context = useContext(AuthContext);

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate("/home");
      navigate("/home");
    },
    onError(err) {
      setError(err.graphQLErrors[0].extensions.exception);
      setError(err.graphQLErrors[0].extensions.exception);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        margin: "10px",
      }}
      noValidate
      autoComplete="off"
    >
      <Stack
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
      >
        <TextField
          name="username"
          label="Username"
          type="text"
          variant="standard"
          value={values.username}
          onChange={onChange}
          error={error === "" ? false : true}
          helperText={error === "" ? "" : error}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="standard"
          value={values.password}
          onChange={onChange}
          error={error === "" ? false : true}
          helperText={error === "" ? "" : error}
        />
        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        email
        username
        password
        roles {
          name
        }
      }
      token
    }
  }
`;

export default LoginForm;
