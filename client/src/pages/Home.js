import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Grid, Typography, Stack, Paper } from "@mui/material";

import AddShrinkItemForm from "../components/forms/AddShrinkItemForm";
import ShrinkItemCard from "../components/ShrinkItemCard";
import { FETCH_SHRINK_ITEMS_QUERY } from "../util/graphql";

export default function Home() {
  const { loading, data: { getAllShrinkItems: shrinkItems } = {} } = useQuery(
    FETCH_SHRINK_ITEMS_QUERY
  );

  return (
    <Box sx={{ marginTop: "10px" }}>
      <Stack
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={8}
      >
        <Typography variant="h3">Recent Items</Typography>
        <Paper elevation={3}>
          <AddShrinkItemForm />
        </Paper>
        <Grid container>
          {loading ? (
            <h1>Loading Items..</h1>
          ) : (
            <>
              {shrinkItems &&
                shrinkItems
                  .sort(
                    (a, b) =>
                      Date.parse(a.expirationDate) -
                      Date.parse(b.expirationDate)
                  )
                  .map((shrinkItem) => (
                    <Grid
                      item
                      key={shrinkItem.id}
                      xs={12}
                      md={6}
                      lg={4}
                      style={{ marginBottom: 20 }}
                    >
                      <ShrinkItemCard shrinkItem={shrinkItem} />
                    </Grid>
                  ))}
            </>
          )}{" "}
        </Grid>
      </Stack>
    </Box>
  );
}
