import React from "react";
import { Box, Typography } from "@mui/material";

import ItemTable from "../components/tables/ItemTable";

function Items() {
  return (
    <Box sx={{ marginTop: "10px" }} alignItems="center">
      <Typography variant="h3" sx={{ marginRight: "auto" }}>
        All Items
      </Typography>
      <ItemTable />
    </Box>
  );
}

export default Items;
