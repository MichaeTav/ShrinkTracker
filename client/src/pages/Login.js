import React from "react";
import { Box, Typography } from "@mui/material";

import LoginForm from "../components/forms/LoginForm";

function Login(props) {
  return (
    <Box sx={{ marginTop: "10px" }} alignItems="center">
      <Typography variant="h3">Login</Typography>
      <LoginForm />
    </Box>
  );
}

export default Login;
