import React from "react";
import { Box, Typography } from "@mui/material";

import UserTable from "../components/tables/UserTable";

function Users() {
  return (
    <Box sx={{ marginTop: "10px" }} alignItems="center">
      <Typography variant="h3" sx={{ marginRight: "auto" }}>
        All Users
      </Typography>
      <UserTable />
    </Box>
  );
}

export default Users;
